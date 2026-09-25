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

WO-155's measurement compares with the highest reachable local release tag
(`vX.Y.Z`) and reports each role's bytes and delta beside its ceiling. The last
acceptance comparison uses the first committed snapshot on the current
branch's first-parent history containing that role's latest global acceptance
(date, then record order). Its source and measured bytes are recorded; the
ceiling and numbers in historical reason prose are not byte measurements.
Missing history or files produce an unavailable delta with a cause.
`--check` evaluates and prints budget advisories without refusing; no flag
prints the measurement alone. `npm run meta` includes the same per-role rows
in its drift signal. The [loading observations](../evidence/WO-155/skill-loading.json)
found fresh Claude Explore and Copilot task workers without the floor in their initial context,
so the full refusals paragraph remains in each skill under WO-155's fallback.

This guide is the operating contract. Harness-specific observations (version,
model and effort readback, Codex sandbox approval) live in
`docs/AI-HARNESS-SECURITY.md` and the playbook, with a pointer where each
left (WO-090, 2026-09-20). The [WO-090 measurement](../evidence/WO-090/README.md)
by WO-039's method records that this guide enters the fixture's directed sets
only through §Goal-aligned decisions; actual orders add their cited sections.
Retiring that section's duplicated role procedure lowers every measured role's
directed total; the harness-observation moves alone left those totals unchanged.

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

**All phases, operator direction 2026-09-11.** Goal Alignment and Process Cost
procedure lives in the generated role skills.

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

Record evidence of benefit and the risks of intervening in existing behavior;
verification and handoff compare observed outcomes with the promised benefit.
Required legal or release actions retain their existing authority; NoOp is a
considered alternative, not an ambient veto or permission to abandon authorized
work.

**Platform lens (operator direction, 2026-09-17).** Four checks from the
platforms lesson the operator pointed at (Steve Yegge's 2011 account of the
Amazon service mandate) apply to any capability a plan or order lands: it
arrives as an interface something else consumes (a transport profile, a
typed event, a projection, a handoff packet), never only as a script or a
session; it is externalizable by construction (content-addressed inputs,
declared contracts, no private setting as the source of a guarantee); this
repository and the operator's own repository consume it before any export;
and its result is usable by a stranger to the session, so a receipt that
needs reverse-engineering is an accessibility failure. The planning
refuter's platform-first standard in this guide is unchanged; the
[2026-09-17 planning document](../planning/vision-into-use-2026-09-17.md)
§12 applies the four checks to the current plan.

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

**The phrase records its own dispatch (operator direction, 2026-09-13).** In
Claude Code the generated session hook does not merely resolve the phrase. When
the canonical status lists the phrase's action (`next`, `fix`, `verify`,
`final-review`) among the legal next actions, the hook runs that `resume`
command itself, records the transition and delivers the command's briefing as
session context before any procedure loads. A phrase whose dispatch is already
recorded passes without a transition and receives the same briefing and
terminal receipt, projected read-only by `npm run resume -- briefing` from the
current phase, so a session that resumes a recorded repair, verification or
final review starts with the support list and intent instruction the recording
session received. A lifecycle that cannot project that briefing accepts the
prompt and supplies advisory context about the missing setup
([WO-130-D015](../evidence/WO-130/decisions.md#wo-130-d015)). A phrase that is
not legal in the current phase is accepted with the lifecycle's legal actions
and no automatic transition. **Operator correction during WO-131:** startup
and prompt submission must never block access to Claude or Codex. Missing
runtime, unreadable state, unavailable briefings and refused dispatches are
advisory at this boundary. Command-time guards still judge attempted effects;
an accepted prompt does not claim its dispatch ran. Worktree creation prepares
dependencies and the hook runtime before printing the launch handoff. A raw or
interrupted checkout can run `node scripts/bootstrap.mjs`; this source-only
entry point and read access remain available even when a pre-tool adapter
cannot load. Bootstrap installs with lifecycle scripts disabled, builds, then
emits the local hooks, with no new operator step. A
lifecycle that exposes no legal actions leaves the command to the role, and
Codex sessions still run the command explicitly (a resumed Codex session runs
`npm run resume -- briefing` itself). The prose duty this replaces was skipped in WO-130's repair
session and cost a second canonical gate
([WO-130-D011](../evidence/WO-130/decisions.md#wo-130-d011)). The dispatch is
admitted exactly as the ordinary `npm run resume -- <action>` command it
replaces: the same active-gate refusal and the same compiled writer-isolation
unit judge the equivalent invocation before the lifecycle runs, so a live
evidence gate or another session's live reservation refuses the dispatch with
the pre-tool hook's reason before any event, checkpoint or control projection
changes, an admitted dispatch holds the reservation the session's first write
would take, and `next` stays the metadata command it is on the tool path
([WO-130-D012](../evidence/WO-130/decisions.md#wo-130-d012)). The briefing
reaches only the model, so the hook also prints a one-line terminal receipt
naming the recorded command, work order, role and equipped supports, and the
delivered context requires the reply to open with the `I intend to` line
before any tool call ([WO-130-D013](../evidence/WO-130/decisions.md#wo-130-d013)).

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
   | `resume: release close` | run the exact `cd <main> && node <main>/scripts/release.mjs close WO-NNN --publish` command projected by `resume release-close` or printed by `worktree publish`; after the subject is already removed, use main's copy | update main, consume the reviewer product gate, publish the validated tag and Release, then attempt worktree cleanup; if Release creation fails after tag push, rerun from updated main |

   Codex sandbox approval for state-changing transitions is harness
   procedure, not lifecycle contract, and lives with the other harness
   settings: the playbook's
   [harness safety baseline](../PLAYBOOK.md#harness-safety-baseline) carries
   the first-invocation approval rule, and
   [`docs/AI-HARNESS-SECURITY.md`](../AI-HARNESS-SECURITY.md#why-recovery-checkpoints-warn-under-sandboxed-codex)
   explains the checkpoint warning, the tested versions, Claude's behavior,
   verification and rollback (relocated by WO-090, 2026-09-20).

3. Record your outcome when the deliverable, report and evidence exist.
   Completion runs `git diff --check` inline. Gate rows, session authorship,
   output reads, usage, projections and planning handoffs are advisory;
   illegal phases and absent/mismatched reports or attestations still refuse:
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
   flags; supplied values remain as given, while `ultra` and `ultra code`
   become `xhigh` with `mode: subagents` and their `raw` spelling. This pre-append check resolves the report/event ordering without
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
`npm run work-orders -- index` after executor dispatch and before its evidence gate.
`implementation-ready` and `repair-complete` refresh the final index automatically,
then release the current Codex session's writer reservation after the result and
observations are recorded. Finish authored writes before that command; reading
the resulting projections needs no new writer. No operator release command is
part of ordinary completion. Verification and final-review actors refresh
after dispatch and after recording their result. `npm run test:docs` includes
`index --check`: it reports a stale projection or a missing/changed recorded tag,
while reporting additional local release tags as newer evidence. Explicit
regeneration includes those tags. The executor's final index refresh is later
than the transition's immutable checkpoint and before writer release.

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
the selected order's v2 Beacon; `status`, `times`, `briefing`, and `next` do not. A warning
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

### Derived work and intent

`npm run dotln -- intent "Describe the work"` files a draft authority in the
configured derived root and prints its identity and path. It does not activate
or execute it. Review the objective, replace placeholder acceptance criteria,
fill in surfaces, dependencies and release classification, then use the printed
identity/path with the ordinary `resume activate` or `worktree start` command.
The same draft is visible in the work-order index. `resume status --json
--work-order WO-NNN` exposes its allocation provenance and phase `none`; the
index and runtime status label that phase `draft`.

Runtime and future UI consumers import `materializeOrder` from
`scripts/lib/derived-orders.mjs`. Pass a complete compiler `WorkOrder`, public
provenance `{ kind: "runtime" | "ui", sourceId: "stable-request-key" }`, and
options `{ root, dependencies, surfaces, releaseClassification, activate }`.
`root` defaults to the selected launchpad, typed dependencies and surfaces to
empty arrays, release classification to `minor`, and activation to `true`.
The result carries `{ workOrderId, workOrderPath, provenance, workOrder, phase }`.
The input is unchanged; the returned work order carries the allocated identity.
Use that identity when compiling downstream graphs or configuring resident
actors. Do not replace a hashed `CompiledProgram`'s identity after compilation.
`repo` must be `self` or a configured public repository id with its full base
commit; committed authority/control records must contain public material only.

An allocation is an append-only `WorkOrderIdentityAllocated` event in the usual
per-order segment. It retains the initial authority and compiled contract so a
retry can restore a missing file after interruption. It also records
`sectionsHash`, the digest of the generated section set it was written under,
and the fold validates the retained authority against that set (an event
without one uses the WO-120 set), so a later section change leaves it foldable.
A corrupt retained authority makes only its own order unreadable: other control
reads continue, selecting that order names its segment, and the derived-order
write path refuses until it is repaired (WO-157; WO-120 D007). Existing files are never
overwritten. The same provenance key with changed inputs refuses; use a new key
for different work. The same key with identical inputs reuses the identity and
never reactivates an already activated order. An edited draft requires explicit
human-reviewed activation. A missing file for an already activated order refuses
rather than restoring an obsolete draft over potentially reviewed work.

All materializers in one shared launchpad use the existing inspected worker
lock; independent checkouts are not a distributed allocator. Range exhaustion
refuses with the configured bounds. Existing handwritten/control identities
are skipped. `dotln status --store <directory> --json` adds `derivedOrders` from
the same selected launchpad control fold (use `DOTLN_LAUNCHPAD` when needed),
including provenance and current lifecycle phase. The resident fixture persists
and recompiles the returned identity across an actual host restart. This order
does not derive new work automatically or implement UI filing.

### Declaring a portfolio

**Added by WO-100 (2026-09-22).** Unattended work is preauthorized by editing
reviewed text, not by a phrase. Declare a portfolio under `portfolios` in the
launchpad's `dotln.config.json`, keyed by its id:

```json
{
  "version": 1,
  "portfolios": {
    "gardener-5s": {
      "version": 1,
      "repo": "scratch",
      "mechanics": ["shine", "sort"],
      "surfaces": ["docs", "loose/guide.md", "src"],
      "phases": {
        "widen": {
          "effects": ["git.local", "repo.read", "repo.write", "shell.run"],
          "files": 1
        },
        "peak": {
          "effects": ["git.local", "repo.read", "repo.write", "shell.run"],
          "files": 2
        }
      },
      "budget": { "episodes": 2, "wallMs": 600000 },
      "verification": {
        "failing-lint": ["node checks/lint.cjs"],
        "failing-test": ["node checks/test.cjs"]
      }
    }
  }
}
```

`mechanics` names the 5S pieces that compile today; `surfaces` are
repository-relative files or directories; `phases` keys are the resident
policy's compiled presence phases, each with the exact effects and file count
an order may carry there; `verification` gives the exact commands WO-054 runs
for each candidate kind. `repo` is `self` or a repository registered under
`repositories` (`scratch` in the example), and a
ceiling outside that repository's `authorityProfile` refuses by path. A
resident binds the loaded portfolio with the target's full 40-hex base commit
id, the only form WO-054 prepares, as its `portfolio` configuration field and runs `portfolio` actors, each reserving
at least its phase ceiling's files, in the phases it names; the resident admits
the binding only inside the compiled floor and each phase's effective envelope,
which must grant a source-change writer. `node scripts/resident-bind.mjs
--portfolio <id> --template <resident.json> --base <commit>` builds that
binding from the loaded entry and compiles the template's graph and
environment under the bound repository's registered `authorityProfile` (a
`self` portfolio has no profile and is refused); `--check <store>` refuses a
store whose portfolio differs from the loaded entry, whose compiled floor
departs from that profile (naming the repository, the profile and each
constraint), or whose profile cannot be read (WO-157). Name commands that test
what each kind promises: WO-054 judges exactly those commands, and the host
itself checks a Sort move's relocation, every order's surfaces and, since
WO-157, the committed path count against the envelope's `files` and any
removal or type change, which only a declared Sort move may make without
`repo.delete`. Every derived order is a WO-120 record
(`provenance.kind: "runtime"`) in the ordinary index and lifecycle; its
authority names the `host-policy` grant. Its provenance key names the
portfolio, version, bound base and candidate, so a new version or a new base
starts a fresh attempt set; the operator's own repositories join only by an
explicit portfolio edit. No
resume phrase changes, and the manual one-slot protocol remains authoritative
for hand-written orders. The skeleton README's portfolio section is the
runbook.

### Where the control plane finds its documents

**Added by WO-069 (2026-09-21).** Every command above resolves its document
roots and its repository root through one loader, `scripts/lib/config.mjs`.
Nothing else in `scripts/` holds a literal `docs/...` root or derives the
repository from its own module URL, and `scripts/test-configuration-root.mjs`
refuses both.

The **launchpad** is the directory whose documents a session owns. It is found
in this order:

1. `DOTLN_LAUNCHPAD`, resolved against the working directory. It must name an
   existing directory; this is how a session running inside a target worktree
   names the launchpad it writes into.
2. Walking up from the running `scripts/` checkout to the first directory that
   contains `dotln.config.json` or is a Git top level.
3. The scripts' own checkout, when that ascent reaches neither.

The working directory never selects a launchpad. A copied script tree is
routinely driven from an unrelated directory, and a working-directory ascent
would let one checkout's session write into another checkout's documents.

`dotln.config.json` at the launchpad root declares schema `version: 1` and the
optional sections `roots`, `repositories`, `build`, `release`, `derivedOrders` and `portfolios` (§Declaring a portfolio). **Its absence
means today's layout, byte for byte**, so this repository ships no such file and
`status --json`, `current.md`, the generated index, `times`, `usage` and a
release manifest derived over the real log are unchanged by its introduction.

`roots` maps a root name to a relative POSIX path inside the launchpad. The
names are `docs` (the document base), `control`, `orders`, `workOrders`,
`verifications`, `finalReviews`, `evidence`, `releases`, `planning`,
`refutations`, `derivedWorkOrders`, `publication`, `intake`, `workstreams`, `lineage`, `product`,
`discovery`, `observations` and `decisions`. An undeclared root defaults under
the document base — `orders` under `control` and `refutations` under `planning`
— with `derivedWorkOrders` under `workOrders/derived`, so moving a parent moves
its children unless the launchpad moves them too. `derivedOrders` declares
`first` and `last` as inclusive `WO-NNN` bounds, defaulting to `WO-900` and
`WO-999`; reversed or malformed ranges refuse.
`repositories` is an object keyed by a public repository id. `self` is implicit
and cannot be registered. Each target value declares `baseBranch`, a relative
POSIX `worktreeParent`, an opaque `repositoryClass`, and a complete
`authorityProfile` in the domain model's `AuthorityEnvelope` shape. The loaded
entry carries its key as `id`; no absolute repository or worktree path belongs
in committed registration. Unknown entry or envelope fields and malformed
effect patterns, limits, expiry or revocation predicates refuse with the
configuration path. `build` carries the launchpad's saved `loadout`, `profile`
and instance `overlay`, and `release` carries the surface toggles `readmeBlock`,
`componentVersions`, `corpus` and `publicationCheck`. Version 1 validates and
exposes these sections; the orders that own `build` and `release` consume
them.

A target work order adds exactly one leading metadata line,
`**Repository:** <id> @ <base-commit>`, where the base is a full 40- or 64-hex
object id. Absence remains the byte-compatible `self` case. Activation resolves
the id through the launchpad configuration and records only `repositoryId` and
`baseCommit`; the current-state Markdown, JSON status (including its orders
list), and generated work-order index project the same pair. The configured
worktree parent and every other physical path stay out of those records. An
unknown id, missing base, malformed object id or malformed registered profile
refuses before the activation event.

The host compiles a registered profile through the existing monotone authority
floor. Profile denials and its expiry, resource, evidence and revocation
constraints narrow the active base. Exact profile allowances outside either
the base envelope or the base WorkOrder operation lists enter through one
retained `registered-repository` grant; applying the same widening without that
exact grant refuses with `AUTHORITY WIDENING`. Wildcard widening remains
unsupported rather than silently broadening the active definition. An existing
grant that would override a profile denial also refuses instead of weakening
the registered restriction.

Validation is positive and unknown keys refuse. A malformed file names its own
path in the refusal, and a root that is absolute, escapes the launchpad, or uses
`.` or `..` is refused by name. One scope limit is recorded rather than
implied: the compiled packages under `packages/` still resolve their own
Git-ignored local harness lane (`docs/control/local/...`) and are not part of
this loader's subject; WO-070 owns the kit's side of that dependency.

## Independent workflows and integration

**Operator correction (2026-09-07, WO-041 breakout):** each work order's implementation and verification progress independently of every other order's phase. Do not require another lane to finish, verify, merge, or release before these transitions. A published dependency needed to implement a feature is still a real input dependency; paired-wave barriers and a verifier-reserve rule tied to the number of waiting orders are not. Actual available actors and one writer per worktree bound resource use.

The operator voluntarily takes one order from final review through PR, merge, and release close before bringing another into final review. Preserve that discipline in handoffs; it is not an enforced cross-order transition gate. It leaves other orders free to implement and verify during that window. A gate for this final-review window is an open option, not authorized implementation. The integrating final-review session owns routine integration within its window, without requiring the operator to arrange earlier sibling phases.

Verification judges its recorded subject. When upstream moves, the integrating actor owns the merge and an explicit assessment of which acceptance claims, if any, changed. Incorporating independently reviewed upstream work, regenerating projections, reconciling additive documentation or independent manifest fields, and retiming an unpublished release under its existing classification are permitted final-review integration work when they preserve behavior, contracts, authority, and acceptance. A new base, a text conflict, a changed whole-tree hash, or a version collision alone is not a failed review. Preserve every original report and source revision; the final report names both bases, resolved paths, carried-forward claims, and checks on the integrated result. It must not pretend an old verdict judged new bytes.

Run the affected executable checks and release/publication preflights on the integrated tree. Feedback evidence uses its declared dependency projection, so workspace release versions and license labels do not demand another live audit. Source, executable configuration, dependency, contract, or acceptance changes still need evidence for the claims they affect. If an integration resolution requires new behavioral code, or a check reveals an actual acceptance defect, return that bounded finding through repair and fresh independent verification; unchanged claims are carried forward with their original evidence. A reviewer never writes a behavioral fix and certifies it. Integration bookkeeping alone must not create a new `VER-NNN`, a failed `FINAL-NNN`, or a repair event.

The existing resume phrases remain the operator interface. The actor performing a handoff completes authorized integration chores within that session. `npm run release -- prepare` handles a colliding target, the README claim, and a dated roadmap note under the recorded release classification. It uses origin's tag observation; `--local` deliberately uses only the fetched local tag snapshot. It never publishes, alters component versions, or appends control events. A missing component bump against the verified branch baseline remains an executor defect. A component bump that was valid at verification may be retimed during integration if upstream consumed the same version, preserving its already-declared compatibility impact and recording that evidence; this is distinct from omitting the original bump. `npm test` runs `check-surfaces --local` before expensive suites against annotated local releases in the subject's own `HEAD` ancestry. Worktrees share tag refs, so an unintegrated sibling's newer tag is excluded from this verification baseline. `worktree publish` / `release close` retain the authoritative remote check on the integrated result. No command acquires authority from a sibling's phase.

Run `npm run worktree -- integrate WO-NNN` inside the matching worktree
([WO-079](../work-orders/WO-079-worktree-sync.md), the successor to WO-033's
sync proposal). It checkpoints current work without a lifecycle event,
keeps a named include-untracked stash, fetches main and tags, fast-forwards
an uncommitted branch or starts a non-rewriting merge, applies the stash,
and regenerates the projections below. Ignored intake requires
`--intake-backup <archive.zip>` naming an external archive whose bytes match
the current intake; `npm run backup:intake -- <authorized-directory>` creates
one. The helper never reads a sibling's phase as admission authority.
The helper refuses an intent-to-add entry (left by `git add -N`) before it
writes anything, and again at `--continue`, naming each path and the remedy
`git add -- <paths>`, because the include-untracked stash can neither save nor
re-apply one (WO-100 D017). A stash push that fails for any other reason with
nothing stashed removes the pending receipt (or restores the completed receipt
it replaced) and prints Git's error, so a fresh run proceeds once the cause is
fixed. When Git stores the stash and then fails (for example cleaning a file it
cannot remove), nothing is merged, the receipt records the stash at stage
`preserved`, and `--continue` resumes at the merge once the tree is clean,
because the stash holds its content; `git stash apply <sha>` and removing the
receipt starts again instead. Only a new stash entry carrying this
integration's name and base commit counts as its own, since the stash stack is
shared by every worktree ([WO-157](../work-orders/WO-157-closeout-followups.md)).

The command lists authored conflicts and exits nonzero while work remains.
Resolve those paths explicitly, stage those resolutions, then use
`npm run worktree -- integrate WO-NNN --continue`. The ignored integration
receipt keeps the original bases, checkpoint and stash across this boundary;
neither stash pop/drop nor a branch commit is performed. A reviewed branch's
authored merge conflict can delay stash application until that continuation.
Generated fragments in mixed documents are re-merged separately from their
authored content. The follow-up register unions entries by id and retains
compatible history prefixes; divergent histories for one id need authored
resolution, because renumbering source revisions would change past meaning.

The helper invokes existing build, harness, index, meta, release-preparation
and publication-lock producers. Console expected outputs are regenerated when
their inputs changed, preserving the authored fixture manifest's selection.
It writes a dated draft integration decision naming both bases and resolved
paths. The reviewer completes carried-forward claims, checks component-version
collisions and evidence-edition changes, runs the printed affected checks,
and owns any merge commit. The helper runs no product gate and records no
repair, verification or acceptance event. A new base is not itself a finding.
The [breakout receipt](../evidence/WO-041/ideation.md) records the measured
failure that prompted this correction.

**Operator decision (2026-09-16, R1 replan pass): two lanes are the normal
workflow.** Two work orders run in parallel worktrees as a matter of
course; the sequence is ordered in lane pairs whose orders name disjoint
primary surfaces and share no hard edge. The operator still takes one order
at a time through final review, pull request, merge and release close; that
remains a discipline in handoff text, not a gate. Because every order since
the stand-down met a sibling at final review and each integration was
handled a little differently (a verifier read a sibling's publication as a
defect; retimes at final review; union merges of the follow-up register;
regenerated bundles and editions), the integrating final review runs this
list, now implemented by `npm run worktree -- integrate WO-NNN`, and nothing
else counts as a finding: preserve the branch's work and
intake; merge main; regenerate the harness bundle and manifest, the
work-order index, `npm run meta` and the publication locks; union the
follow-up register by entry id; retime an unpublished release under its
recorded classification with a dated decision record (a version collision
is bookkeeping); re-run the affected checks and the one product gate on the
integrated tree; and record both bases and the carried-forward claims in the
final report. A sibling's publication, a text conflict, a changed tree hash
and a version collision are never findings, never a repair and never a new
verification. A verifier who meets one records it as an observation for the
reviewer. A step this list does not name is the reopening observation for
this decision. The capture is
`docs/intake/notes/2026-09-16-r1-replan-planning.md` (SHA-256
`07ffad87a856637579b6a40ba7f7bf77a533ccbd5e0622784086bc33a2bab279`).

**Amendment (2026-09-17, vision-into-use pass).** The operator reported the
integration still handled inconsistently and its todo nearly negating the
parallel gain; the record since 2026-09-13 shows integrating final reviews at
a median of about 32 minutes against about 25 for the rest, with a 56-minute
worst case. Two rules follow. The second lane is by preference an
evidence-only or machinery order that touches surfaces the delivery order
does not, so its integration has no release retime and no source merge;
two operator-assisted orders never share a pair. The checklist above becomes
one command, `worktree integrate` (WO-079), which runs its mechanical steps and
prints the affected checks; the list remains its definition. A
final review records a merge blocker only with the command and line that
enforces it; a sentence nothing checks is a documented condition, not a
gate. The capture is `docs/intake/notes/2026-09-17-vision-into-use-planning.md`
(SHA-256 `e267d8e2c26e8c55bacc1e13240b9fac7ec2570ebf0cd0ecfe270ff64b203a26`).

## Operator recovery controls

`analysis:` interrupts the current routine and opens operator-directed diagnosis.
The agent explains the observed state, constraints and next options, and awaits
direction before resuming the interrupted routine. Treat the Westworld analogy
as this interaction shape. Preserve pending work. Diagnostic access cannot
depend on a valid worktree, lifecycle, runtime, version observation or gate.

`operator override:` opens an explicit recovery session in which DotLn's hooks
do not veto the operator's instructions or the tools needed to carry them out.
It precedes runtime imports and repository-state checks. The mode is scoped to
the session and continues until `operator override: off`; a new session does
not inherit it. `analysis:` also suspends hook enforcement so diagnosis cannot
be locked behind a broken command classifier. The phrase itself authorizes
diagnosis; subsequent operator instructions determine any repair effects.
Neither command performs a lifecycle dispatch or claims a check passed.
The agent still acts within the actual operator request and the host's tool
permissions. These controls must be present in Claude's generated entry code
and Codex's shared instructions, with a dependency-free local adapter.

**Candidate — immediate working-state recovery.** Operator override must be
able to restore a usable working repository despite DotLn holds, locks,
incomplete setup or damaged operational state. Recovery may use a dedicated
script or an operator-directed ad hoc repair; no healthy harness or approval
from the broken gate may be a prerequisite. Preserve source, intake and prior
evidence, record the operator's disposition and the old state, and expose which
requirements were bypassed. An operator-authorized working state is distinct
from measured passing verification. General lifecycle reconstruction, live
process handling and the recovery event shape remain planning choices. The
unconditional entry commands are WO-131 scope; this general helper is a
preserved requirement, not a claim of implemented recovery for every corrupt
repository. Source and review duties: [WO-131 ideation receipt](../evidence/WO-131/ideation.md).

**Routes designed (2026-09-25 planning pass).** The recovery event shape
this candidate left open, and the routes a catalog of 101 orders found
missing (seven records corrected after their event, seven override uses
with no record, four operator-owned steps waived in prose, WO-111's request
for "an explicit terminal disposition that does not claim success"), are
[WO-158](../work-orders/WO-158-lifecycle-off-ramps.md): `CriterionWaived`,
`WorkOrderWithdrawn` (terminal phase `withdrawn`), `RecordCorrected` and
`OperatorOverrideRecorded`, each a `resume` command that appends its event
and projects in status, with the operator's captured words for the two
operator acts, and a fixed read-only list admitted during a live gate.
Until it closes, a session that meets one of these situations records a
decision naming the route it would have used; it does not edit a filed
report, amend a criterion to pass, or type a hookless commit. The catalog
and the design are in
[the off-ramps planning document](../planning/off-ramps-5s-entropy-2026-09-25.md)
§3 and §4.

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
5. Treat tensions with settled resolutions in `docs/lineage/resolutions.md` as tensions to surface, not license
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
walking skeleton's founding identity, not a session.

**`planning: entropy reducer`.** This exact phrase makes the pass's subject an
Entropy Reducer review rather than the register's existing rows. The pass opens
with `npm run entropy -- subject`, which names one of three things: a review to
consume, a pending dispatch to finish, or a fresh review to run. **It consumes
before it produces.** A review already filed with a bound refutation and no
disposition is this pass's subject; a new episode — about 993 s and USD 9.50 at
the pinned actor by the REVIEW-002 observation — is paid for only when no such
review exists. To produce one the pass runs
`npm run entropy -- review --transport claude-cli-print` against the committed
subject, files its receipt, and runs `refute` and `refutation-receipt` for the
blinded second worker. Either way it then disposes every surviving finding and
proposal packet **in this same pass**. Accepted findings are this pass's
candidates: they are weighed, sequenced or declined here — in the map, the
sequence and the orders, each decline carrying its `NoOpIntent` record — not
queued for a later pass to read. The generated
`docs/planning/entropy-reviews/REVIEW-NNN.md` rows and the follow-up register
are the durable record of what this pass decided; an item left undecided there
is an ordinary unresolved register row, not a second planning pass waiting to
happen. The phrase is itself the operator request that authorizes the external
CLI launch of the pinned reviewer and its refuter, and it adds no scheduler:
nothing runs a review unless the operator opens a pass this way. A pass opened
any other way may still consume an earlier review's surviving findings as one
input among others.

**First consumption (2026-09-22).** The second pass of that day opened with
`subject`, which named REVIEW-002 under REFUTATION-003, consumed it and paid
for no episode. It re-measured every finding on the current `main` before
disposing it, accepted all four and filed all three packets. Its first draft
routed the findings around a sequence holding the subject's limit of 100
entries, 55 of them closed; the operator asked why closed entries occupy the
planning subject at all, and the record held only a 2026-09-04 convenience
sentence written for a hand-maintained checklist. Under that direction closed
entries now leave the sequence at each planning pass (the generated index's
Closed section is their record), and the accepted findings were filed as
WO-154, WO-155 and WO-156, with WO-153 from the earlier withdrawn draft. A
finding half that a standing operator direction reserves for the operator's
own pass (the cold-start ceiling route, WO-054 D006) stays recorded against
that direction rather than overruled. The record is
[the REVIEW-002 planning document](../planning/entropy-review-002-2026-09-22.md).

**Second consumption (2026-09-25).** `subject` named REVIEW-001 (2026-09-04,
pre-mechanism, no `receiptId`) with `undefined` receipt and refutation
paths; a disposal cannot clear it because the disposed set is keyed by the
missing field. That is a defect (WO-160 item 2). The pass judged the
pre-mechanism pair discharged by WO-023's recorded repairs, ran a fresh
episode against the explicit HEAD commit so planning edits could proceed
while it ran (1,089 s, USD 6.99), refuted it (178 s, USD 0.80), and
disposed all three measured findings and three packets in the same pass:
WO-159, WO-164 and WO-165. An order's final criterion now names both
`npm test` and `npm run test:docs`, because WO-111's executor reached
verification with a green product gate and a red document gate (VER-001
B3). The record is
[the off-ramps planning document](../planning/off-ramps-5s-entropy-2026-09-25.md)
§9.

Preconditions and inputs:

1. Run on the clean main checkout. Between work orders is the normal case; an
   active order is context, never a scope fence, exactly as in ideation mode.
   Run `npm run plan -- start <slug>` before the first planning write. It
   requires clean main and creates `planning/YYYY-MM-DD-<slug>` through the
   classified command path; unknown tool effects are advisory and host permissions decide. It also
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
the dedicated refuter skill in either harness. The parent runs
`npm run plan -- refute` (add `--scope full` for the whole horizon; `--direct`
remains an alias). The command verifies the committed subject equals the
workspace and prints the canonical prompt and closed JSON schema. The parent
spawns one fresh background worker without inherited conversation, supplying
only that prompt and the shared goal card. In Codex this uses `spawn_agent`
with `fork_turns: none`; in Claude it uses a fresh background agent. The worker
judges the supplied prompt directly, returns its frozen JSON and a truthful
single-line statement of at most 4000 characters, and makes no repository or
Git writes. The parent remains the sole writer and can finish independent
closeout work while waiting without changing the frozen subject. Save the
worker's judgment and statement in ignored local files,
then run `npm run plan -- receipt <result.json> --statement <statement.txt>`
with any required `--dispositions <file>`. The helper validates, screens,
files and commits the immutable pair with a plain subject and runs the plan
check. No ad hoc receipt code is needed.

The default pass scope judges orders created or changed by the latest dated
planning pass, plus the sequence; unchanged orders carry their latest verdict
by hash. The receipt records scope, carried identities and dispatch-to-file
wall-clock. Wall-clock is observed, with no pass-budget refusal.
Full scope judges every order. Independence remains session-attested; no
unknown model setting becomes readback.

After drafting, commit the planning subject locally and use this background
worker workflow for independent refutation. External review through
`npm run plan -- refute --transport <name>` requires an explicit operator
request; never fall back to it automatically. If background workers are
unavailable, preserve the pending review and report the limitation. Repair a
worker's result formatting with that same worker without rerolling its judgment.
An explicitly requested transport's failure includes its CLI exit code and stderr. Direct and external
judgments retain the same hold and disposition rules. Finish with
`npm run test:docs`: index, publication, formatting, plan and current-document checks. It builds
missing/current runtime output for the named projection comparisons, without
the product or machinery fixture suites. The [receipt convention](../planning/refutations/README.md)
details the result and provenance contracts.

New judgments use `aligned`, `aligned-with-findings` and `misaligned`. Only
misalignment supported by an observed failure or a supplied vision passage
holds. A constructible counterexample is a known issue with a concrete
reopening observation. Each judgment answers critical-path and NoOp cost,
all eight system traps, removal balance, and failure behavior. Missing cost
observations remain unknown.

There is one judgment per planning pass. Repair a named criterion and record
`npm run plan -- dispose <receipt-id> <hold-id> '<disposition and reason>'`.
The existing control log binds the original and accepted criterion text, including
repairs of historical holds. A goal-review disposition or override also binds
the exact old and accepted Cost declaration when that field changes. It admits
only those bound repairs; no second judgment follows unless recorded evidence changes. A timestamp refresh
alone is not new evidence. An operator-authorized override retains its ignored
intake capture and provenance. Accepted text cannot be raised as another hold;
later concerns become known issues with reopening observations. There is no
third-hold stop. Historical receipts retain their original bytes and meaning.

The gate is forward-only from the mechanism's first-parent introduction/merge
date. Earlier headings, including same-day headings already present at that
boundary, are exempt. Every later dated planning-pass heading needs an addressed
receipt. The latest receipt remains bound to its original committed subject.
The continuing-work gate compares both HEAD and workspace inputs with it,
admitting an assigned release placeholder, appended execution-record
sections, and appended dated capability additions or reassessments for orders
in that reviewed sequence, including new ids. Verification, final review and
the next planning receipt judge their level claims. It reports these execution updates separately;
they are not a fresh planning verdict. Existing text and rows, objectives,
dependencies, non-goals, sequence, vision and roles still require a
matching subject. WO-139 adds the explicit execution-amendment route for
operator-authorized scope changes: record the authorization in the affected
order's structured decisions, then run `npm run plan -- amend-order WO-NNN
WO-NNN-DNNN "operator authorization and bounded scope"`. The helper appends
`PlanExecutionAmended` to the existing planning control log, binding the
current planning receipt, original order, approved order text and individual
decision. It preserves existing execution evidence; later strict execution
appendices and release-title retiming remain admitted. Unrecorded changes
still fail; criterion drift names its criterion, while a non-criterion byte
change can fail without naming its order. The decision records the authorization;
the `PlanExecutionAmended` event binds that decision but has no actor field.
Neither is a fresh planning verdict or a way to discharge an independent hold. Do this during authorized execution rather than carrying an
inherited failure through later reviews. The WO-053 amendment recorded under
WO-139 repairs the reproduced inherited failure without changing receipt 017.
If committed execution overwrote an existing capability row, restore the judged
source and append the exact newer row as a dated reassessment. The continuing-work
check reports a pending history repair before commit only when every changed HEAD
line is a same-ID capability row preserved byte-for-byte in that appendix, with
all historical bytes restored. Dropped claims, changed headings, changed IDs and
other committed edits still fail. After commit, ordinary reassessment rules apply.
Criterion and goal-review Cost repairs use their text-bound disposition. Producing a new receipt still requires its
complete committed subject and an identical workspace. Earlier receipts keep
their judged revisions, with unresolved holds carried through the receipt chain.
WO-126 has one explicit contract-adoption exception: the exact
legacy-unavailable Cost declaration may be inserted after an existing order
heading without rewriting its prior verdict. It claims no measured reduction;
new refutations judge that missing evidence. Arbitrary headers and substantive
authority edits remain outside this exception.
WO-135 also admits the exact release-header correction from
`patch, evidence-only. A` to `patch. Evidence-only: a` (likewise for minor and
major), preserving the release type and every following description byte;
it reports `release-classification-format` without rewriting the receipt.
`plan check` and `work-orders index --check` check every unmet typed blocking
edge between sequenced orders and refuse a blocking edge inside a two-entry pair;
larger groups retain serial dependency order. On a `planning/` branch created by
`plan start`, Claude hooks refuse classified repository writes outside `docs/`
and root Markdown (WO-135); external scratch remains admitted, Codex carries
the same duty as role text, and `operator override:` admits authorized recovery.
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
  criteria, evidence, non-goals, and operator-review assumptions; an order
  that changes a file the feedback verifier judges (`FEEDBACK_SOURCE_PATHS`
  in `packages/skeleton/src/feedback-audit.ts`) beyond a component release
  label, or changes the regenerated feedback report, names the feedback
  re-mint and one live feedback self-host episode in its Cost line and
  dispatch dimensions (WO-147 D010; WO-154 D001 keys schema 2 feedback
  editions on that judged behavior, so a registered-source edit that leaves
  both unchanged needs no live episode; a compiler release moves only the
  policy hash the console binds, so it owes the deterministic
  `feedback-evidence --carry` and a console re-pin, never a live episode,
  WO-154 D011); an order that edits any other
  registered evidence source (`scripts/lib/evidence-sources.mjs`) names the
  deterministic re-mint of each edition whose check it stales (WO-152 D004:
  `evidenceSourceContent` normalizes component release labels away, so a
  version-only bump never makes an edition stale);
- product-doc write-back for durable understanding, with the publication
  index and edition locks repaired in the same pass;
- `npm run meta -- --plan-cost` refreshes the bounded, subject-hashed cost
  table after the subject revision. It carries latest meter rows and trap
  signals. Stale or missing observations are labeled; cost shortfalls become
  planning input and never create an automatic structural hold;
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
freshness; executor deferrals need a checked public FUP destination. Because
the identifier is minted by the collector, run `npm run plan -- followups
--sync` after recording the decision and before disposing the queue item onto
it; WO-064 D011 and WO-152 D011 record the advisory that disposing first
leaves. Neither the
feed nor a disposition grants work-order activation authority.

## Research and guided-operator work orders

Operator decision, 2026-09-17 (the vision-into-use planning pass, from the
2026-09-16 guided-operator ideation and the operator-endorsed brief of
2026-09-17). Not every valuable order begins with a known implementation or
ends with the hoped-for result. A research order investigates a question
whose answer changes a decision; a guided operator order reaches a setup or
result with the operator's participation. Both use the ordinary work-order
file, lifecycle, evidence directories, verification and final review; no
kind field, transition or command is added. WO-027, WO-044 and WO-053 are the
existing practice this section names.

1. The Objective states the question or hypothesis and the decision it
   informs. The Design states the setup, the permitted effects, a bounded
   budget (attempts, wall-clock, tokens where the harness reports them) and
   the stopping conditions. The acceptance criteria are method criteria: the
   artifacts, their `observed`/`blocked`/`unavailable`/`ambiguous` labels,
   provenance, budget adherence, and an outcome reported as exactly one of
   `ready`, `negative` or `inconclusive`. A criterion never requires that
   the experiment find a winning approach; it requires methodological
   completion and honest reporting.
2. A guided operator order names the operator's steps; the agent proposes
   the next step from observed results, keeps unexecuted proposals distinct
   from observations, preserves progress across sessions, and closes in one
   of two ways: the declared check passes, or a failure artifact records the
   attempted path, the observed errors, the ruled-out causes, the remaining
   blocker and the next useful action or reopening condition. A failure
   artifact discharges the investigation and never marks the setup as
   achieved. An environment limitation is distinguished from a DotLn defect.
3. The execution record's first sentence names the outcome class. A
   `negative` or `inconclusive` outcome closes a research order and
   satisfies no implementation or live-proof criterion; a research outcome
   is planning evidence, never a capability level (the capability table's
   rule that only real workflow evidence promotes stands). An order whose
   criteria require an observed successful capability keeps its own rule
   that a failed run does not close it. The typed dependency graph
   expresses closes, not outcomes, so an order that requires a `ready`
   outcome of a research order says so in its activation preflight and its
   first criterion, and an order that may proceed on doubles while a live
   row is unavailable says that instead (WO-138 and WO-110 are the two
   forms, 2026-09-17).
4. Experimental code lives under `scripts/probes/` or the order's evidence
   directory, carries tests proportionate to its risk (the existing rule for
   ideation helpers), is reviewed as code, and is promoted into supported
   product code only by a separate implementation order that cites the
   receipt.
5. Live model evaluations and live harness launches run under explicit
   `probe:` or `evidence:` commands, or a probe script invoked by path with
   its exact command named in the order, never inside `npm test`; add an npm
   alias when a second order reuses the probe (planning decision 7,
   [2026-09-19](../planning/outstanding-cleanup-2026-09-19.md#5-decisions-of-this-pass)). Deterministic
   adapter and protocol tests stay in the gate. A change to the transport,
   the tool or output protocol, the model artifact or quantization, the
   runtime's version, or authority behavior triggers live requalification,
   recorded as a dated discovery row. Live local inference runs when no
   product gate is running on the host, because the gate bands are timing
   evidence.

The verifier judges method and honesty; the reviewer judges the decision
packet and whether a speculative result was presented as settled.
[WO-136](../work-orders/WO-136-authority-enforcement-boundary.md),
[WO-137](../work-orders/WO-137-local-runner-readiness.md) and
[WO-138](../work-orders/WO-138-local-model-role-qualification.md) are the
first orders written to this section; the
[planning document](../planning/vision-into-use-2026-09-17.md) §5 records
the alternatives declined. Reopen when an index consumer needs the outcome
typed, or when a research order is cited as a capability.

## Candidate — guided operator work orders

**Disposed 2026-09-17:** the section above is this candidate's convention,
and WO-137 is its first use. The text below is retained as the source.

Operator direction, 2026-09-16: a work-order type should carry guided human
work through the normal workflow. Its purpose is to help the operator reach a
specific result or setup, including ordinary trial and error, and return either
evidence of success or a useful failure artifact. Local inference readiness and
possible LM Studio setup are the immediate example; this is a general pattern
for work that requires operator participation, not a separate informal checklist.

A candidate contract names the desired observable result, starting conditions,
constraints and authority, agent and operator responsibilities, success checks,
and the evidence to retain if attempts fail. The agent proposes the next useful
step from observed results, explains required operator actions, records what was
actually attempted and adapts the next step. Unexecuted suggestions remain
distinct from observations. Preserve progress across pauses and sessions so the
operator can resume the same order. Trial and error is expected learning, not a
reason to restart the workflow or silently expand authority.

Two explicit outcomes are needed: a result/setup that passes its declared check,
or a failure artifact describing the attempted path, observed errors, ruled-out
causes, remaining blocker and a useful next action or reopening condition.
Distinguish an environment limitation or exhausted attempt from a defect in
DotLn. Producing the requested failure artifact can discharge the investigation
deliverable, but never certifies the original setup as successful. Independent
review should judge the evidence appropriate to the declared outcome.

The next planning pass should decide how to express this type using existing
WorkOrders, human-handoff actors, continuation and evidence surfaces, including
how lifecycle status distinguishes successful setup from completed investigation
with failure. Preserve the normal authority, privacy and review boundaries.
No new schema, lifecycle transition or implementation is selected here.

Source: the operator's second 2026-09-16 ideation during WO-051, synthesized in
the ledger and [breakout receipt](../evidence/WO-051/ideation-local-models.md).
Reopen at the next planning pass with local-model readiness or another concrete
operator-assisted outcome. The cost and value question is whether this removes
repeated setup explanation and lost diagnostic work without adding a separate
process the operator must manage.

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

**Measured 2026-09-16 (R1 replan pass).** The pass consumed the feed's first
page and selected nothing from it: 283 of the 287 pending rows are the
untriaged migration and the three open items were declined again, as in the
two passes before it. Orientation still needed canonical status, the
sequence, the previous planning document and its ledger section, the three
subject orders, the writing-worker record, the seven closed orders' decision
records and final reviews, and the code surfaces the orders name. The feed
cannot be judged until the register settlement candidate below removes the
migration rows from the pending set; this candidate stays open.

**Measured 2026-09-19 (cleanup pass).** The first page showed four
invalidated dispositions, one open item, two deferrals and one untriaged
row of 371 pending, and the pass again selected nothing from it; it read the
whole register by batch instead. That pass disposed the pending rows, so the
next planning pass is the first that can judge the feed; this candidate
stays open until that measurement.

**Measured 2026-09-21 (standard pass).** The first page showed six
invalidated dispositions and the two open items, of 149 pending; the pass
selected nothing from it and read the whole register by script, because the
67 rows that mattered were untriaged and the page orders them last. It also
read canonical status, the sequence, the two 2026-09-20 planning documents
and receipt 021, the decision files of the eleven orders whose rows were
untriaged, the map's two candidate sections, the cost table and the budgets
file before choosing anything. The feed carried real nominations for the
first time (WO-142 row B17's boarded defects), so its content is now right
and its ordering is the remaining friction: untriaged rows should precede
invalidated dispositions when a pass opens, and a pass needs the count of
rows per source order, not a first page of eight. No order is allocated;
reopen at the next pass with that ordering tried, or when the first page
again shows nothing the pass acts on.

**Measured 2026-09-22 (closeout follow-ups pass).** The first page showed
three invalidated dispositions, three open items and two deferrals of 150
pending; the pass selected nothing from it and read the register by script
because the 29 untriaged rows (decision records from WO-063, WO-064,
WO-100, WO-120, WO-151 and WO-152) were paged last. Orientation also read
canonical status, the sequence, this guide's planning and ideation sections,
the three same-day planning documents' route and answer sections, the
decision files of six orders, two final reviews, the map's three latest
candidate sections, the queued orders' headers, the budgets file and the
integrate helper's source. The ordering friction stands as recorded above;
one further ask: the first page should say which closed orders contributed
the untriaged rows. Stays open.

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

WO-128's [first accepted shared row](../evidence/WO-128/shared-series-002.json)
now supplies that evidence: 689.520 s wall-clock, 2674.262 s
of task time, and a 688.383 s observed scheduler chain. Its
largest chain node is `plan-refutation:fixtures` at 523.842 s;
the [complete offline trace](../evidence/WO-128/diagnosis.md#accepted-shared-series-and-deadline-comparison)
retains every edge and visible wait. Five shared passes keep the exclusive
flags removed, but their median 694.561 s exceeds the exact earlier
476.304 s gate. This is reliability evidence and a measured entry point for
planning, not an allocation or a demonstrated structural speedup.

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

**Superseded 2026-09-15.** The recorded 2026-09-15T04:10Z gate names the
bounding nodes: the machinery's own suites (harness fixtures 145 s, process
debt 143 s, runner fixtures 135 s isolated, plan-refutation fixtures 69 s)
on a lane-saturated schedule, while the longest suite numbers (console,
release, plan-refutation) were spans between split tasks. The machinery
stand-down pass removes that share from the default gate and runs the gate
once per order instead of cutting its fixtures
([WO-132](../work-orders/WO-132-machinery-stand-down.md) criteria 4 to 6).
Reopen only if the once-per-order `npm test` exceeds six minutes fresh after
that inventory split.

**Reopening observation recorded 2026-09-19 (cleanup pass).** The seventeen
final-review product gates recorded in `docs/control/orders/` since
2026-09-16 ran 303 to 1,178 s, median 793 s; sixteen exceeded six minutes.
The cause of each (suite selection, host load, an integrated sibling) is not
analysed; the gate rows this pass could read carry a total and no per-suite
durations. The `fastGateMs` ceiling of 120 s was WO-126's budget for a fast
gate that WO-132 removed; the metric has since read the one full product
gate, so the same day's second pass unset the ceiling in
`docs/control/budgets.json`. Nothing is allocated: an order that shortens the
gate needs the per-suite breakdown first, and none is recorded.

**Re-measured 2026-09-21 (standard pass).** The thirteen final-review product
gates recorded from 2026-09-19 to 2026-09-21 (WO-142 to WO-069) ran 256 to
536 s, median 483 s; eleven exceeded six minutes. The `FinalReviewCompleted`
gate row still carries `durationMs`, a code identity and an exit code and no
per-suite durations, so the same reason holds: nothing is allocated until a
breakdown is recorded. The meter's drift signal flagged the gate's step count
rising 65, 72, 73, 74, 80 across WO-090 to WO-069 as a reopen candidate; each
order added suites or cases, so the count is planning input for this
candidate, not a hold. The candidate stays open.

**WO-156 planning-check cut (2026-09-24, executor measurement).** Resolving the
work-order root pattern once per subject call reduced the fixture's `statSync`
calls from 543 to 10 while preserving its subject JSON. On this host,
`node scripts/refute-plan.mjs check` fell from 17.86 s to 2.85 s and the
`test:docs` `plan` and `plan-refutation-current` tasks fell from 25.27 s and
25.20 s to 3.25 s and 3.19 s; the full document gate fell from 30.80 s to
24.41 s because other tasks still run concurrently. Those initial figures
missed the 2 s bound and led to VER-001 and the operator-authorized repair.
The repair batches immutable Git reads and caches unchanged normalization
within 512 entries and 1 MiB of string storage. The first repair measured
1.799–1.823 s versus 3.121–3.177 s with the pre-repair sources, with identical
stdout and 98 Git launches versus 242. VER-002 then found optional-prefetch
and aggregate-buffer regressions. Their correction measured 1.657–1.667 s
versus 2.792–2.824 s on the same tree, with identical stdout and 104 launches;
the six additional historical fallback reads preserve accepted inputs. Its
`test:docs` plan tasks took 1.90 s and 1.81 s. The [WO-156 decisions](../evidence/WO-156/decisions.md)
and [repair evidence](../evidence/WO-156/repair.md) preserve the comparisons,
refusal checks and reopening conditions. This local measurement does not
assign a new structural cut to the broader product gate.

**Console collection is the gate's critical path (2026-09-25, REVIEW-003
ER3-002, reproduced by REFUTATION-004).** With the plan tasks under 2 s,
`console-docs` runs 20.06 s of a 24.81 s `test:docs`: 101 sequential
`resume status` forks (12.8 to 13.3 s) and one `release list` of 5.2 to
5.6 s over 1,050 Git spawns, linear in tag count. Allocated to
[WO-164](../work-orders/WO-164-constant-process-console-collection.md);
the 2026-09-19 deferral's reopening observation has occurred.

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

**Resolved 2026-09-15.** The machinery stand-down pass measured the yield:
receipts 009 to 012 held four times on constructed counterexamples at
2,454, 833, 333 and 755 s, two holds were overridden, and one overridden
hold was re-raised by the next receipt and re-imported as scope, producing
a design that failed verification and was removed. The pass selected the
bounded scope and changed the hold semantics together: the refuter judges
goal alignment, system traps, constraint removal and antifragility from the
Cost line, the meter and the critical path; only an observed failure or a
vision contradiction holds; a constructible counterexample is a known issue;
one judgment per pass, no third-hold stop, no budget refusal, and a
disposition binds the criterion text. Allocated to
[WO-132](../work-orders/WO-132-machinery-stand-down.md) criterion 11; this
candidate closes on that order's merge.

## Candidate — follow-up register settlement

The register holds 297 entries with 283 untriaged (2026-09-16). Two
mechanisms fill it: the migration harvested every historical candidate
heading and NoOp bullet as a pending row, and every per-order decision
record is harvested as a follow-up although a decision with a
`reopenWhen` observation is a record, not an action. Three planning passes
have selected nothing from the feed. A later pass may spend one session
settling the migration rows as historical, and may change the collector so
a decision record enters the feed only when its reopening observation has
been recorded. No order is allocated; reopen at a planning pass that has the
session to spend, or when the pending count exceeds three hundred.

**Measured 2026-09-17 (vision-into-use pass).** 359 entries, 348 pending,
344 untriaged; the 62 entries added since the R1 pass are 45 decision
records, four ideation candidates, fifteen defect-register items and one
NoOp bullet, and every one was untriaged until this pass disposed the
candidates and the register items it decided. The pending count crossed
three hundred by harvesting decision records, so the threshold rises to
four hundred; the collector change stays the candidate's substance.

**Settled and allocated 2026-09-19 (cleanup pass).** 399 entries (235
decision records, 164 candidate rows), 371 pending, 364 never triaged (228
decision records, 136 candidate rows).
The operator budgeted the session this candidate asked for. Eight read-only
batch surveys classified every pending row against `main` at `3b3533f8` and
the pass disposed them; the counts and the rows that carried real work are
in [the planning document](../planning/outstanding-cleanup-2026-09-19.md)
§2. After it: 417 entries, none untriaged, five open and 76 deferred with
reopening conditions. The collector change is
[WO-142](../work-orders/WO-142-outstanding-cleanup.md) row A1. Reopen if
untriaged rows pass fifty after WO-142 closes.

**Implemented in WO-142 (2026-09-19).** A decision enters the pending feed
only when it names a `followup`, or another decision records an observed
reopening through `reopens.decisionId` and `reopens.observation`. A
`reopenWhen` condition by itself creates no action. The decisions index still
lists every record; existing register entries, identifiers and history are
retained. Executor, verifier and reviewer role text now requires an encountered
defect to be fixed inside the Boy Scout bound or boarded up as a decision
record naming its follow-up, cited by the report. The collector change and
before/after observations are recorded in
[WO-142 evidence](../evidence/WO-142/README.md) and its
[decisions](../evidence/WO-142/decisions.md). The next planning pass's feed
size and untriaged count are the reopening observations; the fifty-row
threshold above stays in force.

**Reopening observation recorded 2026-09-21 (standard pass).** 486 entries,
149 pending, 67 untriaged after WO-142 closed: 65 decision rows from
eleven orders closed on 2026-09-19 to 2026-09-21 and two planning candidates.
The threshold fired for a different reason than the migration refill it was
written against: the rows are B17's boarded defects and the collector is
doing what WO-142 made it do. Inside them, 16 are in-order repair directives
(a verifier's `followup` beginning "In resume: fix" or "Repair ... VER-001
F<n>") that the order's own repair cycle discharged before it closed, two are
decisions reopened by those repairs, and four are final-review routings the
review discharged; all 22 were settled by this pass with the closing evidence
named. The remaining 45 were settled, allocated, deferred or left open one by one
([the standard-pass planning document](../planning/standard-pass-2026-09-21.md)
§3). The `followup` field therefore carries two things the feed cannot tell
apart: routing inside an order and a nomination that outlives it. No
collector change is allocated; the smallest fix is role text (a verifier
names in-order routing in the decision and the report, and reserves
`followup` for what outlives the order), which is a bundle regeneration for
the next order that edits the verifier role. Reopen when the next planning
pass counts more than ten discharged in-order directives in its untriaged
rows, or when untriaged rows again pass fifty.

## Candidate — local lane retention

Ignored local lanes grow without a rule: 13 immutable harness runtime
snapshots (34 MB), 36 MB of hook journals and 31 MB of retained close lanes
on 2026-09-16. A retention rule may remove a snapshot no installed manifest
pins and a retained lane older than its order's published release, keeping
the retained-lane byte proofs. No order is allocated; reopen on disk
pressure or when the snapshot count exceeds twenty.

**Reopened and allocated 2026-09-19 (cleanup pass).** 27 snapshots (80 MB)
with one pinned, 99 MB under `docs/control/local/`, and 96 MB under
`.git/dotln/suite-success`, which no source has written since WO-132
removed the suite-success cache. Allocated to
[WO-142](../work-orders/WO-142-outstanding-cleanup.md) row D1: an on-demand
prune that lists before it deletes.

**Implemented in WO-142 (2026-09-19).** Run
`node scripts/harness.mjs prune` to list removable paths, byte totals and
reasons for retaining other paths; this form writes nothing. After reviewing
the listing, `node scripts/harness.mjs prune --apply` removes only candidates
whose ownership and byte inventory still match a fresh observation. Installed
manifests and target installation receipts across registered worktrees protect
their snapshots, including targets in separate repositories. A live gate,
another live or unknown writer, unreadable pins, current or live session
ownership, and missing session-end observations retain the affected files;
legacy advisory markers without session ownership are retained. The dead
suite-success cache is eligible only without a live gate.

A retained order lane is eligible only after its worktree is gone and a
non-draft published Release and matching remote tag establish publication.
The command first keeps a sibling `WO-NNN.bytes-<digest>.json` inventory of
paths, modes, byte lengths and SHA-256 hashes, then removes the lane. Symlinks,
special files and nested repositories are retained. This is an on-demand
command, not a new recurring check. The real-checkout listing, before/after
sizes and fixture evidence belong to
[WO-142 evidence](../evidence/WO-142/README.md) and its
[decisions](../evidence/WO-142/decisions.md). Reopen on disk pressure or an
observed retained candidate that the documented ownership/publication rules
cannot explain.

## Candidate — stale writer reservation self-diagnosis

WO-050 VER-001 observed a Codex executor's reservation outliving its
session with `liveness: unavailable`, refusing every shell command of the
next session including `node scripts/harness.mjs writer --show`, until an
operator released it from a terminal. The kept invariant is right; the
diagnosis path is not. The candidate admits the writer inspection and
release commands under a foreign reservation, reports the holder's age on
every refusal, and has the Codex lifecycle completion release the
reservation it holds. The stand-down declined a shell classifier; this
candidate needs none. No order is allocated; reopen on a second observed
occurrence.

**Substance shipped 2026-09-18 (recorded by the 2026-09-19 cleanup pass).**
WO-139's commit `3ea00e50` releases the executor's writer at completion
(`scripts/lib/executor-handoff.mjs`; `scripts/resume.mjs`
`executorWriterRelease`), and the hook admits
`node scripts/harness.mjs writer --show` among its repository commands
(`packages/skeleton/src/harness-host.ts`). The holder's age on every refusal
was not checked by that pass. Reopen on a second observed stale reservation.

## Candidate — total subagent cap across every spawn path

Operator direction, 2026-09-17: a session's total subagents need a hard,
configurable cap (about twenty), because a top-level guideline of five fans
out through per-item adversarial and refutation trees to more than a
hundred. The harness documents no total cap, only a size guideline, a
concurrency ceiling of sixteen and a per-workflow limit of a thousand; its
hooks fire for the Agent and Workflow tools and inside subagents. WO-139
counts and refuses at the admission points the hook can see and counts
descendants at their first attributable tool call, so an agent the harness
creates before any hook fires is counted late or not at all, and Codex's
`spawn_agent` fires no hook in the recorded profile. The 2026-09-18
[WO-139 probe](../evidence/WO-139/README.md) observes Claude 2.1.276 sharing
`session_id` and supplying distinct `agent_id` values for direct and workflow
children. Direct Agent results join that identity to `tool_use_id` when the
result is observed, including immediately for background spawns. Probe 2 also
observed `SubagentStart` carrying `session_id` and `agent_id` before each
child's first tool call; no hook is registered for it and its ability to deny
is untested ([WO-139 review, items 5–6](../final-reviews/WO-139/FINAL-002.md)). During unresolved overlap the counter reports a minimum
distinct count, preserving every observation and excluding children seen
before a later spawn; it never invents a parent link. For example, two
unresolved direct admissions and two later workflow children can represent
four agents while the minimum is two. Agents created before their first
hook, silent agents, unknown identities, unreadable counters and this
unresolved overlap remain outside an exact total guarantee. The requirement that remains open is a
guaranteed maximum across every path: admission before creation, including
descendants and concurrent spawns. No order is allocated for it; the
Contributor's batching rule is the interim control. Reopen when the harness
documents a pre-creation admission hook or a total-cap setting, or when a
session exceeds the cap on a path WO-139 reports as uncounted.

## Workflow closeout and releases

Final review publishes the reviewed work-order branch and PR; the operator
retains merge authority. After merge, `resume: release close` authorizes the
exact helper command printed by `resume release-close` or `worktree publish`.
Run main's helper with main as the working directory; retries use the same
updated main after the subject is removed.

The command proves origin reachability first, fast-forwards main, checks the
README release block, component bumps, notes profile and license pins, and
builds missing skeleton/kernel dist using installed dependencies. It consumes
the committed final-review event's passing `npm test` row. The reviewed source
and merged source must have equal code identity; the tag manifest records both
trees, the code identity, duration, time and evidence reference. It runs no suite,
`npm ci` or CLI smoke. Reports, control events, generated indexes, PR bodies and
release notes may follow the gate without changing its identity.

`--publish` creates and pushes only the validated annotated tag, then creates
its matching GitHub Release. The current human notes remain byte-exact from
review through tag and Release. Never move a tag, edit a published Release,
push main or imply package/binary/hosted distribution. An equal target is an
idempotent retry only when the immutable tag names the same commit and manifest;
a differing Release body refuses without editing it. If Release creation fails
after tag push, rerun the same command. A lower target is an explicit no-release
outcome. A deliberately deferred eligible release needs a durable disposition.

Only tracked dirt refuses publication. Untracked and ignored local material is
listed and retained. After publication, worktree finish and derived-worktree
settlement run as best effort. Cleanup blockers are reported without failing a
successful publication; never force teardown. The existing preservation helper
keeps single-copy intake and non-disposable control material in main's ignored
`docs/control/local/retained/WO-NNN/` lane, preserving collisions and checking
copied bytes. It refuses unsafe symlinks and uncertain writer/gate ownership.
Those teardown protections remain independent of publication eligibility.

`--dry-run` previews the prospective merged revision, manifest and cleanup
without moving main, registering/removing a worktree or publishing. It fetches
origin metadata and may build missing preview runtime in owned scratch, using
existing dependencies. It runs no suite or installation. Host egress and
approval remain host controls; the authorized session uses that permission flow.

`worktree publish` validates the committed review row against the branch's code
identity and adds its machine-readable record to the PR body. Existing DCO,
publication, license and source-only controls remain. `npm run release -- notes
vX.Y.Z` and `npm run release -- list` inspect local annotated records without
network. Historical backfill remains separately authorized through
`release publish-notes`; old tag manifests retain their original contracts.

**Target publish (WO-064).** `worktree publish WO-NNN --target <request.json>`
publishes a target order's source-change episode in the target repository; no
launchpad branch moves and none of the self-publication records apply. The
host-owned request names the loadout, its compilation environment (never a
grant registry), the episode store, the pull-request base branch and an
optional verification store. The writer ran the loadout without its
`repo.push`/`pr.open` grants; publish recompiles both forms and requires the
episode's persisted identity, WorkOrder and envelope to equal the writer form,
the target branch to still name the observed commit, and the binary diff
digest to match the receipt. Each of `repo.push` and `pr.open` must be allowed
by the effective envelope and WorkOrder, pass the kernel guard, and be named
by an admitted grant whose `grantedBy` is `operator`. The branch, every pushed
commit message, the title (the host commit subject) and the generated body
(contract, acceptance matrix or its stated absence, host test outcomes, diff
summary) must pass the outward lint, and absent local terms refuse. A supplied
verification store must hold one acceptance matrix for the published head whose
criteria are exactly the WorkOrder's acceptance criteria; a matching revision
alone does not make another contract's verdicts this one's. Every
refusal precedes the first remote call. The host then pushes only the observed
commit without tags or upstream configuration, from a host-created bare
repository with hooks off, so neither the target's hooks nor its repository
configuration (an SSH command, an include, a receive-pack override, a
repository-scoped credential helper or URL rewrite, or an operator's pre-push
check such as a Git LFS upload) runs in the operator's publish process; the
push URL is origin's configured URL before any rewrite and must name the
repository the `gh` check resolved (WO-157; WO-064 D010). It opens the pull request through
the existing `gh` helper and appends `PullRequestOpened` to
`<store>/publication/`. A rerun for the same head reports the recorded pull
request and pushes nothing. Merging and releasing on the target stay with the
operator; [decisions](../evidence/WO-064/decisions.md) record the limits.

## Documentation freshness and ownership

The executor owns current factual documentation for its change. Before declaring
implementation ready, update affected blueprint facts and their reader entry
points in the same pass: examples, names and paths, component/source claims,
capability limitations, runbook instructions, planning recommendations, and
publication links where the change reaches them. Use the diff and inbound
references to bound the check. Record the affected surfaces and evidence in the
existing work-order outcome or breakout receipt; do not create a new ceremony
or rewrite unrelated historical artifacts. A README “What runs today”
write-back rewrites the existing release block rather than appending another
release sentence, keeping it within fifteen sentences and moving per-order
detail into release notes ([WO-068-D004](../evidence/WO-068/decisions.md#wo-068-d004)).

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

- **Outward artifacts (WO-063).** The [pure lint and stdin CLI](../evidence/WO-063/implementation.md) check conventional commit subjects, PR titles and branch names plus the configured public vocabulary and redacted local-term check, report absent local coverage as `unavailable`, and leave publication integration to WO-064.

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
  requiring a named-support prompt. Completion advises about queued/running items;
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
- **Never guess — observed facts and advisory measurement (WO-141).** The
  briefing, Claude prompt context and Stop advisory print the clock, journaled
  background dispatch times with last observed state and elapsed time, gate
  durations, and usage counters with source and cutoff. Missing values remain
  `unknown` with a cause. Within a dispatch, the earliest terminal observation
  fixes a task's state and elapsed time; later statusless reads, errors or stops
  cannot restart it. Claude's prompt hook reads native task notices directly
  when the transcript has not yet flushed them. It uses the prompt boundary's
  time until an earlier transcript timestamp is observed, which can shorten
  the recorded terminal elapsed time. The same scoped parser handles both
  sources and retains only hashed task joins, status and time. A lexical estimate marker attached to a number,
  duration or clock time in final assistant text is journaled with the observed
  quantity when unambiguous, otherwise `unmeasured`; quotes and fenced code are
  exempt. Its correction is delivered once at the next boundary. This holds no
  turn, refuses no action and causes no Stop re-entry. Codex has no Stop hook:
  lifecycle and briefing output run the same scan over already available final
  messages and their handoff text; a later final answer waits for the next
  boundary. The journal counts typed `correction:` events and hedges by order,
  phase and explicitly named unit: never guess, accuracy over sycophancy
  (`correctness-over-sycophancy`), `anti-oscillation`, and the ban on over-literal
  or malicious compliance (`fail-conservative-correction`). Untyped corrections
  and unmarked guesses are outside this lexical count. The meter's
  shifting-the-burden row measures these events without automatic consequence;
  it no longer treats decision documents as correction telemetry.
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
  itself the defect; `docs/lineage/resolutions.md` and `docs/decisions/` close
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
- **Isolation.** The main checkout is the control plane. Product changes remain reviewed through branches/worktrees; a session may
  plan, build, bootstrap and publish on main under its writer reservation; verify `pwd` and repo root before any
  git operation. One writer per worktree is enforced by the generated hook's
  reservation, keyed by the session and its harness process. A session refused
  for a foreign reservation runs `node scripts/harness.mjs writer --show` to
  name the holder: a dead holder is reclaimed automatically at the next write
  and two sessions racing for the same dead holder admit exactly one writer,
  a live one must finish, and an operator releases a stuck one from a terminal
  outside any governed session with `node scripts/harness.mjs writer --release`
  (`--force` only for a live owner; a release acts only on the holder it
  judged). The branch name is not a writer predicate. A second live writer still refuses;
  unclassified tools and command shapes delegate to host permissions.
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
- **Process budget (WO-132, 2026-09-15).** Compare total work and waiting
  against the failure a mechanism prevents. `npm run meta` prints each closed
  order's Cost promise beside available observed gate/usage rows and their
  cutoffs. Explicit measurable shortfalls are planning inputs; ambiguous or
  missing observations are unknown. No cost, duration, context or token
  observation refuses a command or completion. Entry/handoff usage is recorded
  when available, never substituted from another session or invented as zero.
  Counters and final timings stay in ignored local observations and the
  response; reports may cite them without causing a product-gate rerun.
  A verification or final-review receipt allocated under WO-140 carries
  exactly one physical `**Process cost:**` line: `entry <total> tokens;
  handoff <total> tokens; source <source>`, or `unknown; cause <code>` with
  exactly one code from this closed list: `hooks-fallback` (the session's
  hooks ran in their fallback, so no session observation exists),
  `no-session` (no harness session was found for this role and order, so
  usage had no subject) and `harness-no-readback` (the harness exposes no
  complete session counter readback; utility-request counters alone are
  partial). A new cause adds a code here and in
  `scripts/lib/receipt-cost.mjs`, never a free-text unknown. `verify` and
  `final-review` stamp the duty on the receipt they allocate, so every earlier
  receipt, and a sibling worktree's receipt allocated before it integrated
  this rule, is not judged and no receipt is edited retroactively. The
  `verification-result` and `final-review-result` transitions judge the
  stamped report beside its actor header, while its author can still edit it,
  so an immutable receipt is never the first to meet the rule;
  `npm run test:docs` refuses the same line afterwards. The line may be
  indented or a list item, and a fenced example is not the line. The dispatch
  briefing prints the session id and the exact
  `node scripts/harness.mjs usage <session>` command. No counter value is
  ever required: `unknown` with its cause code is always admitted, so the
  rule never blocks a handoff on an unavailable measurement.
  All eight system traps and Naive Interventionism remain decision lenses,
  with the NoOp comparison in the existing per-order decisions. Historical
  WO-126–WO-131 measurements remain immutable evidence of the retired system.

  The complete wrapped Cost paragraph is the promise, through its next field,
  paragraph or end of file. Only finite, nonnegative measured durations can
  establish a gate-time outcome; an observed zero remains valid. Estimates
  and limits in other sections are not inferred as Cost ceilings. The
  [WO-132 repair decisions](../evidence/WO-132/decisions.md#wo-132-d004)
  record the parser correction and its end-to-end regression.

  The cold-start ceilings in `docs/control/budgets.json` (installed
  `CLAUDE.md` plus the role skill, per role) have one normal route
  (operator direction, 2026-09-17): a reviewed rule that breaches a ceiling
  raises it in the same change by one 4 KB step above the measured bytes
  with the rule named, or records a dated acceptance for that metric; the
  breach is never trimmed around, never resolved by cutting another rule,
  and never left advisory across orders. `npm run meta` reports the verdict;
  the [WO-044 decision](../evidence/WO-044/decisions.md) of 2026-09-14
  (caps yield to needed rules, accuracy before efficiency) is the policy,
  and the [2026-09-17 pass](../planning/vision-into-use-2026-09-17.md) §10
  records the two acceptances made under it.

  WO-054 raises the executor ceiling to 24,576 bytes and release-close to
  16,384 bytes for the shared advisory-boundary and Codex continuation rule
  (measured 20,849 and 12,437 bytes in both roots). The operator directed
  incrementing these now and reviewing efficiency later; see
  [WO-054-D006](../evidence/WO-054/decisions.md#wo-054-d006).

  During the live gate, the existing shell destination adapter retains
  activation's literal argument forms for `echo`, `printf`, `cat`, `pwd`,
  `true`, `false`, `ls`, `head` and `grep`, including combined flags, stdin
  `-`, and dash-prefixed data. These programs have no file-output or
  program-execution option; shell expansion and output redirections are
  screened separately. The added `tail`, `wc`, `ps`, `sed` and `git` programs
  have bounded flag vocabularies, including attached `tail -n5` / `-c5` counts.
  Literal pipelines retain every recognized write destination.
  In the destination adapter, Git reads require `git --no-pager status`, or
  `git --no-pager log` / `git --no-pager diff` with both `--no-ext-diff` and
  `--no-textconv`; explicit write-capable options remain refused. The sed form
  is only `sed -n Np` or `sed -n N,Mp` followed by literal paths. `find`,
  `node -e`, other sed scripts and unrecognized flags on the added programs
  remain opaque. WO-142 B3 pins activation parity and read/write fixture pairs.
  The older metadata exception separately admits exact forms including
  `git status --short` and `git diff --check`.

  Git admission is not proof of no filesystem or configured-program effect.
  The admitted prefix `git --no-pager --no-optional-locks -c core.fsmonitor=false`
  prevented the index refresh and fsmonitor invocation for `status` in the
  isolated Git 2.55.0 probe. It did not prevent `diff` from rewriting the index
  or invoking a configured clean filter, and admitted `log` can invoke
  `gpg.program` when `log.showSignature=true`. Log/diff still need the flags
  above. Closing these effects across both the metadata exception and the
  destination adapter is the explicit
  [Git-effects follow-up](../evidence/WO-142/decisions.md#wo-142-d012--retain-existing-git-admission-with-an-explicit-effects-follow-up);
  requiring the prefix alone would not discharge it.
  Ordinary literal redirections and chained writes identify their destinations,
  including the descriptor-style `>&file`, `1>&file` and `>>&file` forms that
  VER-002 found admitted; a descriptor number or `-` after `>&` names no file.
  Zsh's `>>&` is append redirection: its operand is a filename even when it
  is numeric or `-` (VER-003 F1). Redirect operands must start with an ASCII
  letter, digit, dot, underscore or slash, or be the literal dash filename.
  Shell-special prefixes such as `!` (zsh's clobber override) and `=` remain
  opaque and are refused during a live gate (VER-004 F1); the adapter does
  not pass their ambiguous spelling to the path classifier.
  `for` loops, substitutions and other opaque commands retain their conservative
  gate refusal; use the host's read tools for those reads. This does not change
  writer reservations or the host's permissions. See
  [WO-132-D005](../evidence/WO-132/decisions.md#wo-132-d005),
  [WO-132-D006](../evidence/WO-132/decisions.md#wo-132-d006),
  [WO-132-D007](../evidence/WO-132/decisions.md#wo-132-d007) and
  [WO-132-D008](../evidence/WO-132/decisions.md#wo-132-d008).

- **Machinery stand-down (operator direction, 2026-09-15).** The lifecycle
  exists to carry the rules so the operator's attention does not; when it
  costs more attention than it saves, it is the defect. The operator's
  standard, recorded from the 2026-09-15 planning dispatch and implemented by
  [WO-132](../work-orders/WO-132-machinery-stand-down.md): a lifecycle
  transition records its report and never runs or requires a test gate; one
  product gate, `npm test`, runs once per order at final review, keyed by the
  code it tests so that reports, control events, projections and release text
  never invalidate it, and that row is the evidence the pull request, the tag
  and the close consume; release close is the post-merge publish of the tag
  and Release and runs no suite; attested harness, version, model and effort
  are logged as given and never refuse, and `ultra` means `xhigh` with
  subagents; DotLn has five hook refusals (WO-135, WO-139 and WO-144): a second writer in a
  worktree; a write during the live gate; a classified repository write
  outside `docs/` and root Markdown on a `planning/` branch; an observable
  subagent admission exceeding `docs/control/budgets.json` `subagentCap`
  (default 20, `null` disables); and a known outside-project write destination
  without a containing root declared by its active role or equipped support
  and admitted through the compiled authority envelope. Root kinds are system
  temporary, DotLn session scratch, main's ignored intake and an operator-named
  absolute root; the manifest names declaration and authority-grant sources.
  The six default roles carry temporary and session-scratch grants only.
  `os.tmpdir()` identifies the temporary root; scratch is
  `<system-temp>/dotln/<session-key>/scratch`. Claude role dispatch prints the
  concrete path; Codex uses `node scripts/harness.mjs scratch`. Use that scratch
  path: native scratch and `/tmp` need a separate grant when outside system-temp.
  Literal redirects to the `/dev/null` character device discard output; other
  device mutations still need grants. Symlinks and removals use physical
  destinations. The outside-write judgment holds from any working directory
  and resolves relative destinations there; the four older refusals are judged
  only at the worktree root and journal their stand-down elsewhere. A literal
  redirect is judged on any program (`npm run meta 2>../.x` refuses); a
  destination spelled with an expansion such as `$PWD`, the recorded incident's
  own spelling, a relative redirect after an unrecognized earlier program, and
  whatever a program writes by itself stay unobserved under host permissions,
  which is most shell calls; a
  guard failure advises once and preserves the other refusals. In-project
  writes do not consult this grant. `operator override:` remains recovery.
  Order-named roots do not automatically become grants. Workflow admission needs a remaining unit;
  the workflow call consumes none, and attributable children count at their
  first tool call. Missing/unreadable counters admit with a cause-specific
  advisory. Stop and `harness usage` report observed count, cap and unknown
  remainder; unresolved direct/child overlap is labeled a minimum. Plan the
  whole fan-out against the root's remaining budget before the first spawn,
  state it in the response, and batch review/refutation over item groups:
  one agent judges several items, never one agent per item per pass. Codex carries
  the same duties, grants and advisory cap as role text, without outside-write hook enforcement; other judgments delegate to host permissions; the default gate holds the suites that
  protect product and lifecycle behavior, each naming what it protects, and
  the machinery's own suites run on demand; the planning refuter judges goal
  alignment, system traps, constraint removal and antifragility, and a
  constructible counterexample is a known issue, never a hold. A complaint
  or direction the operator states in a capture is a decision and is
  recorded as one. A mechanism is added only with the removal it pays for,
  reconciled at closeout against the observed rows. WO-132 implements this contract; `operator override:` remains available for
  authorized recovery. The diagnosis of how four passes compounded the
  problem is [the planning document](../planning/machinery-stand-down-2026-09-15.md).
  WO-142 separates advisory identities within each session. Runtime messages
  share a key only within their own cause (`pins-differ`, `snapshot-missing`,
  or `runtime-unavailable`); subagent-budget messages share one key per cause
  (`missing`, `unreadable`, `overlap`, or `unavailable`). Other messages beginning
  `DotLn advisory:`, including command classification, use a
  digest of the message across hook kinds, so repeating the same advisory is quiet while a
  distinct advisory can appear. Typed `observer-input` errors, such as an
  outside-worktree read observation, do not consume `runtime-unavailable`.
  The atomic marker stays in ignored harness state and records session
  ownership for pruning. Every invocation retains its journal row;
  PostToolUse observers emit no advisory. If marker storage is unavailable,
  the message remains visible. SessionStart reuses the session handler to compare
  built bytes and the pinned snapshot, without dispatching work. `resume` and
  `plan start` diagnose runtime drift without building. Release close and worktree
  finish rebuild after their fast-forward when pins differ, preserving publication
  preflight ordering and the worktree on build failure. All roles retain supplied
  model and effort with source `operator-attested` when effective readback is
  unavailable; only an unsupplied value is `unknown`. Authorized product-document
  edits are followed by `npm run publication:check`. See
  [WO-133 decisions](../evidence/WO-133/decisions.md).
- **Codex continuity after compaction (WO-054 scope expansion, 2026-09-18).**
  The Codex contributor bundle uses `PostCompact` to record the turn and
  `SessionStart` with `source: compact` to restore its saved unfinished work
  order as developer context. An old side question does not replace that task.
  A synchronous `Stop` hook can request one continuation for the compacted turn
  when the same root session still owns the writer and its recorded completion
  event remains outstanding. It does not dispatch, acquire/release ownership or
  start another worker. Duplicate/already-continued stops cannot loop. Explicit
  recovery controls remain decisive; native interruption remains with the host,
  and missing state leaves native stopping available. The adapter does not parse
  conversational stop/resume language or maintain an extra pause protocol. The
  operator's repair clarification names the actual failure: automatic compaction,
  an answer to an old message, then idle. Recovery uses the unfinished task state
  regardless of that reply. This operator-authorized continuation is a narrow exception
  to advisory completion judgments and adds no tool/write refusal. A native
  Codex CLI 0.155.0 probe demonstrated context delivery and continuation without
  an external wake-up; desktop activation is not established. Native hook trust
  is required, and the checked CLI loads linked-worktree definitions from the
  root checkout. See [behavior, proof and activation](../evidence/WO-054/codex-continuation.md)
  and [D005](../evidence/WO-054/decisions.md#wo-054-d005). The original native
  probes did not exercise interruption; no native interruption proof is claimed.
- **Write once, run once (WO-132).** The reviewer stages intended new source
  files and runs `npm test -- --review` once after the last source edit. The
  runner records `npm test` by tracked, non-generated code identity, excluding
  `docs/`, `.claude/`, `.agents/`, root Markdown and Git's `dotln-generated`
  paths. The exact tested tree remains beside that key. New source bytes
  require a new final product gate; report/control/index/release-text edits do
  not. Executor and verifier run product tests when useful to their evidence.
  WO-133 keeps the host and both profiles' skeleton version in
  `packages/skeleton/src/version.ts`, outside machinery source declarations but
  inside runtime pins. Review selection uses the existing evidence content
  projection for compiler/package version literals, so version-only bumps select
  no machinery suite; a host behavior edit still selects its declared suites.
  Lifecycle transitions run only the inline whitespace check and record their
  reports/attestations without gate, read or usage prerequisites.
- **Gate sandbox preflight (WO-140, 2026-09-19).** A suite declares
  `needs: outside-sandbox` only when an environmental cause means it cannot
  pass inside a harness sandbox; a failure inside one is never by itself a
  reason to declare. `skeleton` carries the declaration: its native script
  cases nest `sandbox-exec`, which an outer Seatbelt sandbox refuses, in every
  receipt that ran the gate inside one. `portfolio` carries it too (WO-100,
  2026-09-22): its WO-119 discovery checks and WO-054 witness launch
  `sandbox-exec`, and inside an outer Seatbelt profile both end-to-end tests
  stop at the refused discovery launch. `release` does not: WO-121's F1 was a
  defect, and its one temporary-root failure inside the sandbox passed inside
  in every other receipt. A recognized marker (`CLAUDECODE`, or Codex's
  `CODEX_SANDBOX`) names the harness and establishes nothing alone, because a
  run with the sandbox disabled inherits it; one exclusive create in the path
  that sandbox protects (`.claude/hooks`, or the resolved Git directory)
  decides. Every marker present is probed, because one harness can inherit
  another's. Only `EPERM`, `EACCES` or `EROFS` on that create reads as a
  sandbox; a created probe file is removed, and a removal the host refuses is
  reported on the row, never thrown. When the write is denied and the
  selection needs the outside, `npm test` refuses before the build and every
  suite, names the suites and prints the command that runs the same selection
  outside. No marker, a missing probe directory, a permitted write or a probe
  that fails fails open and the gate runs as before; only a selection that
  needs the outside pays for the probe. `npm test -- --inside-sandbox` runs
  the remaining suites and records that same identity, with `partial` and
  `excludedSuites`, never
  `npm test`; `findGateCheck`, the lifecycle transitions, pull-request
  publication and release close reject that row, and reject exclusions under
  any identity. Running unsandboxed stays the operator's approval and is never
  automatic. In an operator-attended session the verifier and reviewer run the
  product gate outside from the start; a resident-launched verification runs
  the inside selection and reports its exclusions as a partial result. See the
  [WO-140 decisions](../evidence/WO-140/decisions.md).
  The runner's gate-sandbox fixture disables Git's automatic maintenance
  before its first commit (WO-157, from WO-063 D005): Git 2.55 estimates loose
  objects from `objects/17` alone, so two loose objects there made a fixture
  commit start a detached geometric repack still writing `.git/objects/pack`
  when the teardown removed the tree (`ENOTEMPTY`). Each gate tags the
  `dotln-gate-sandbox-*` roots its suites create and fails, naming them, when
  one survives its suites; another run's roots and untagged roots are never
  judged, and the check removes nothing.
  Live gates still protect source, installed inputs and the success record
  from concurrent writes. One registered writer owns the worktree. Other hook
  judgments advise and delegate to host permissions. `node scripts/harness.mjs
  evidence --stop` ends the session's own gate at its next boundary and records
  no passing check. Children retain owned process-group cancellation, finite
  deadlines and peer observations. `harness evidence` remains a convenience
  for product and diff checks; `--fail` records only the diff check. It is not
  a lifecycle prerequisite. Read authored outputs and validate generated
  outputs using their existing commands, without a new receipt ritual.

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
- **Gate execution and reuse (WO-132).** `npm test -- --list` prints each
  product/lifecycle suite and the operator-visible behavior it protects.
  Suites run fresh in the working tree, one task per suite except independent
  release cases, which share a prepared synthetic template and run in multiple
  lanes. Replica copies, declared-input keys, shared success cache, kernel-denial
  probes and their machinery-only tests are removed. `npm run test:machinery`
  runs the machinery suites on demand; the reviewer's `npm test -- --review`
  includes them only when their own declared sources changed since the base.
  Document-sensitive live checks remain in `npm run test:docs`.
  The scheduler retains load-derived deadlines, peer observations, a four-lane
  cap and bounded live progress. Harness fixtures and process-debt fixtures use
  exclusive scheduling, restoring the faster measured WO-128 D010 choice
  (462 seconds exclusive versus 666 shared). Future scheduling changes require
  a same-source comparison. The acceptance target is three consecutive fresh
  product gates below 360 seconds on the operator's host; their rows belong in
  WO-132 evidence. No product test is deleted; product-test removal still goes
  through the mutation corpus. The immutable WO-129–WO-131 records describe
  the former implementation, not current reuse behavior.

- **Return shape.** End with a compact result: what changed, evidence pointers,
  deviations from the work order, open questions. Terse; no narration theater,
  no apology theater.

## Model-specific notes

Behavioral guidance rots across model generations; that is why it lives in
this repository as typed mechanisms and docs instead of prompts. If an
instruction here fights your model's defaults (e.g., built-in verification),
flag it in your result rather than ignoring it.

State the harness, version, model, effort and source actually run in the
result and in the completion flags; §Operator resume phrases step 3 carries
that contract, the actor-attestation header rule and the `ultra` spelling
normalization. The per-harness observations that lived here moved on
2026-09-20 (WO-090), each to one home, and this section keeps the pointers:

Independent verifiers use `xhigh` rather than `max`. A verifier launch may cap
provider spend at USD 5 when the selected transport exposes a hard dollar-cap
control. A recorded budget on a transport without that control is a limit
declaration, not an enforced cap, and must be reported that way.

- Required attestation fields, `unknown`, Codex thread readback, the
  `--account-label` grammar, the Codex 0.154.0 effort probes and the WO-126
  CLI version-line observation with its session-detection channels are in
  [`docs/AI-HARNESS-SECURITY.md` §Harness version, model and effort readback](../AI-HARNESS-SECURITY.md#harness-version-model-and-effort-readback).
- Claude Code's selected-session readback (`CLAUDE_EFFORT`, source
  `claude-session-readback`, WO-157) is in the same section.
- Copilot selected-session readback, its completion line and its counters
  are in [§Copilot CLI](../AI-HARNESS-SECURITY.md#selected-session-readback-completion-and-counters).
- Control-event timing (WO-028) and the separate dispatch usage channel
  (WO-126) are in the playbook's
  [resume command surface](../PLAYBOOK.md#resume-command-surface).

The [WO-090 relocation table](../evidence/WO-090/README.md#relocation-table)
accounts for every paragraph that left.
