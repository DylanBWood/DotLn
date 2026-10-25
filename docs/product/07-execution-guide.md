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
`--check` refuses any unresolved `Read:`, never a budget advisory;
no flag prints the measurement alone. `npm run meta` includes the same per-role rows
in its drift signal. The [loading observations](../evidence/WO-155/skill-loading.json)
found fresh Claude Explore and Copilot task workers without the floor in their initial context,
so the full refusals paragraph remains in each skill under WO-155's fallback.

This guide is the operating contract. Harness-specific observations (version,
model and effort readback, host permission modes) live in
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
verified source-to-deliverable loop.

<!-- dotln-goal-rules:start -->

The [sequence](../planning/sequence.md) and selected work order determine
current placement and authority. The mission is the outcome; the critical path
is the dependency route to the next outcome. Useful prerequisite or
risk-reduction work must name the blocked outcome it enables. Process activity,
receipt volume and agent utilization are not progress by themselves. Goal
alignment grants no authority to reorder or expand work. In all phases, the Goal
Alignment and Process Cost procedure lives in the generated role skills
[WO-043, 2026-09-11].

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

<!-- dotln-goal-rules:end -->

**Platform lens.** Four checks from the platforms lesson the operator
pointed at (Steve Yegge's 2011 account of the Amazon service mandate) apply
to any capability a plan or order lands: it arrives as an interface
something else consumes (a transport profile, a typed event, a projection, a
handoff packet), never only as a script or a session; it is externalizable
by construction (content-addressed inputs, declared contracts, no private
setting as the source of a guarantee); this repository and the operator's
own repository consume it before any export; and its result is usable by a
stranger to the session, so a receipt that needs reverse-engineering is an
accessibility failure [[vision-into-use pass](../planning/vision-into-use-2026-09-17.md)
§12, 2026-09-17]. The planning refuter's platform-first standard is
unchanged.

<!-- dotln-goal-rules:start -->

Material choices and rationales go in existing phase evidence: per-order
`docs/evidence/WO-NNN/decisions.md` and cited product sections for work-order
decisions; planning dispositions/candidate records for planning choices; the
independent report or refutation receipt for its judgment; retained closeout
evidence for release decisions. The decisions index exposes per-order records.
Reuse and link a current rationale until its assumptions change; do not create
a parallel decision log or an extra approval ritual.

<!-- dotln-goal-rules:end -->

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

The resident's `console-commands-v1` loopback surface serves these same terminal actions, including the release-close publish helper; the terminal permission hook's classifier and decider judge each one under the resident's compiled envelope and the console refuses what they deny or cannot classify, its terminal parser and lifecycle guards still apply, and console-actor receipts record it (product 04 §Console parity contract v1).

Load the generated role skill named by the cold-start table. Its procedure is
the session adapter to the detailed contract below. Claude's generated prompt
hook resolves the exact phrase and reiterates the selected order path; Codex
uses the same floor dispatch with its project skill. Keep `npm run harness --
check` green after changing the Contributor source and regenerating the bundle.

**The phrase records its own dispatch.** In Claude Code the generated
session hook does not merely resolve the phrase [WO-130, 2026-09-13]. When
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
dependencies, pinned Chromium and hooks before launch. Raw or
interrupted checkouts can run the source-only `node scripts/bootstrap.mjs`
without a built adapter; read access stays available. Bootstrap disables npm
lifecycle scripts, installs the browser in the suite's cache, builds and emits
hooks. Failure preserves the checkout and names a retry. A
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

A successful foreground lifecycle command may bind a roleless observed session
after checking the canonical transition; this observation grants no publication
authority. A failed canonical read skips binding with one advisory and retains
ordinary tool observations. Manual `harness begin` refuses every existing state
path; only lifecycle-owned automatic entry may upgrade valid roleless state.

**First-party session commands.** These prefixes are part of the supported
command vocabulary alongside `resume:`, `planning:` and `ideation:`
[WO-043, 2026-09-11]. They do not create lifecycle events:

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
   | `resume: release close` | in a main-checkout session, dispatch `npm run resume -- release-close --work-order WO-NNN`, then run its printed `node <main>/scripts/release.mjs close WO-NNN --publish` helper there (`worktree publish` prints it too); a subject dispatch prints this route; use main's copy after subject removal | update main, consume reviewer gate, publish validated tag and Release, attempt cleanup, refresh each declared export sibling through its recorded checkout with one fast-forward commit to that sibling's main carrying core's tag name and the sibling's Release, and write `docs/control/local/retained/WO-NNN/release-close.json`; for a registered target order, fetch and fast-forward the clone's base, delete declared disposable output, remove the order's literal host rules, and tag and release the target only under `release.policy: declared`; rerun from updated main if Release creation fails or a starter refresh refuses |
   | the operator accepts criterion N unmet (words captured) | `npm run resume -- waive N --reason <text> --capture <intake file> --capture-hash sha256:<digest> <actor-flags>` from the operator's terminal, a verifier or a reviewer session (WO-158) | the report records `**Criterion N:** unmet, waived by <ordinal>`; the order's executor never records a waiver |
   | the operator withdraws the order (words captured) | `npm run resume -- withdraw --disposition failed\|superseded\|abandoned --reason <text> --capture <intake file> --capture-hash sha256:<digest> <actor-flags>` (WO-158) | stop: `withdrawn` is terminal, and only `npm run resume -- activate` of a changed revision with a new dated `**Reactivation (YYYY-MM-DD):**` note leaves it |
   | a recorded attestation, report path or checkpoint is wrong, or a recorded passing final review carries no product gate | `npm run resume -- correct <ordinal\|report-path> --set <field>=<value> --reason <text> <actor-flags>` (WO-158); `--set productGate=<evidenceRef>` binds a complete passing `npm test` row whose code identity is the one the pass recorded in its checkpoint and still the working tree's, once, and is the only correction legal in `closed` (WO-115) | never correct a verdict or edit a filed report; a wrong verdict takes a later report; a changed subject takes a fresh final review; publication and release close read the bound gate from the committed correction |
   | `operator override: off` | nothing in Claude, whose hook appends `OperatorOverrideRecorded`; otherwise the printed `npm run resume -- override-record ...` command (WO-158) | record what the override changed in the order's decisions |

   The operator's standing posture, reaffirmed 2026-09-25 (WO-161), is no
   host sandbox in Claude Code, Codex or Copilot. DotLn refusals plus the host
   permission mode are the boundary. The playbook's
   [harness safety baseline](../PLAYBOOK.md#harness-safety-baseline) and
   [security note](../AI-HARNESS-SECURITY.md#why-recovery-checkpoints-warn-under-sandboxed-codex)
   retain the checkpoint approval procedure only for Codex `workspace-write`
   plus `on-request`; full-access sessions have no such approval path. This
   is harness procedure, not lifecycle contract (relocated by WO-090,
   2026-09-20; scoped to the actual posture by WO-161).

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
   automatically when creating a work-order worktree, carries the main
   checkout's ignored local-terms list into it when one is registered there,
   then prints the shell-safe
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
read the [generated work-order index](../work-orders/README.md) for the active
and sequenced orders and [its history page](../work-orders/HISTORY.md) for the
settled ones; for recommendation, rationale, tracks, and human preflight, read
[`docs/planning/work-order-map.md`](../planning/work-order-map.md). Keep the
three answers separate: legal lifecycle transition, dependency/preflight
eligibility, and recommended choice. Never infer any of them from the next
integer. The map is a dated human projection, so revalidate its candidate
against the authoritative work order and current control evidence before
activation.

WO-026's generated index, two pages since WO-190 (`README.md` holds the
active line, the sequence with its lane pairs and the Active and Open cards;
`HISTORY.md` holds the settled cards, the sources and limits and the tag
record), observes current headers and control evidence with a
recorded snapshot of local annotated release tag objects and the control
segments contained in each tagged revision. Prefix checks are per segment; a
sibling merge cannot shift another order's close ordinal. Run
`npm run work-orders -- index` after executor dispatch and before its evidence gate.
`implementation-ready` and `repair-complete` refresh the final index automatically,
then release the current Codex session's writer reservation after the result and
observations are recorded; `verification-result`, `final-review-result` and a
successful `release close --publish` release their session's the same way.
Finish authored writes before that command; reading
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
merge it. For a registered-target order the reviewer commits the reviewed
target change on its `wo-NNN` branch before recording the passing result,
records the order's records in the target's documentation root as one
records-only commit after it, and may push that commit to one conventional
branch on the target's origin and open its pull request with `worktree publish
WO-NNN --target-worktree` under an admitted operator grant, spelled
`node scripts/worktree.mjs publish WO-NNN --target-worktree …` from the
launchpad root (since v0.87.0 the hook admits only that spelling and
withholds the `npm run worktree -- publish` form with an advisory naming
it, WO-218 D062); it never merges either. An instance order may name an actor and the phrase for the opt-in
`--draft` form at `verified`, which pushes the target worktree's working tree
to that branch under a draft pull request the closed-phase publish reuses;
core declares no draft step and no actor (WO-221). Its Change table describes
the subject against its merge base with the target's base branch fetched at
publish, retaining the activation base when it is not an ancestor of that
merge base and naming it beside the described base when the two differ.
Release close of a target
order fetches the target's base branch and
fast-forwards the clone's base branch before it judges containment. Release
close may create and push only the validated annotated tag, create the
matching GitHub Release as a projection of that tag's reviewed human layer, and
push one verified fast-forward commit to the `main` of each declared export
sibling from its recorded checkout (§Workflow closeout and releases, Starter
refresh); it may never edit a published Release, push core's `main` or any other
branch or repository, publish packages/binaries, or change repository settings. The operator retains PR merge
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
configured derived root and prints its identity and path. Filing does not
activate or execute it. A resident with a covering `intent` portfolio and
admitted operator grants admits the unchanged draft itself: it screens the
issue, compiles its contract and derives surfaces, then records
`IntentAdmitted`, stating why standing authorization supersedes the draft's
human-review constraint, before it materializes or dispatches anything.
Uncovered, ambiguous, malformed or over-ceiling inputs record a permanent
`IntentHeld` and dispatch nothing. Without that authorization, review the
objective, replace placeholder criteria, fill in surfaces, dependencies and
release classification, then use the printed identity/path with
`resume activate` or `worktree start`.
The same draft is visible in the work-order index. `resume status --json
--work-order WO-NNN` exposes its allocation provenance and phase `none`; the
index and runtime status label that phase `draft`.

`npm run dotln -- vertical ISSUE --store DIRECTORY` runs the same persisted
continuation on demand. Both entries share one admission ledger, converge at
the accepted binding and never repeat a completed step, and a failure names
its step. The baseline consumes reviewed, source-bound assertion judgments and
parses no English. The skeleton README documents the store inputs, the
judgment schema, holds, recovery and evidence limits.

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
including provenance and current lifecycle phase. The resident persists and
recompiles the returned identity across an actual host restart; UI filing
remains a separate consumer.

### Declaring a portfolio

Unattended work is preauthorized by editing reviewed text, not by a phrase
[WO-100, 2026-09-22]. Declare a portfolio under `portfolios` in the
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

An intent portfolio adds `"class": "intent"`, a registered target with an
authority profile (never `self`) and exact test commands under
`verification.intent`. Remote effects also need operator grants that contain
only remote effects. Admission intersects the phase envelope, the portfolio's
surfaces and budget, and the grants. Discovery portfolios keep their shape.

### Where the control plane finds its documents

Every command above resolves its document roots and its repository root
through one loader, `scripts/lib/config.mjs` [WO-069, 2026-09-21].
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

Target orders pair a code worktree with a launchpad order worktree. Run that
launchpad's scripts, or name it with `DOTLN_LAUNCHPAD`; its ignored target
registry selects the order by branch. A registration lands on its order's
branch before `main`: `worktree clone <id> <absolute-path>` records into the
main checkout's ignored clone map and accepts an id that either the main
checkout or the running checkout declares, so a registration order records
its clone before the merge, while `worktree start` reads the merged
registration from `main`. Selection compares physical launchpad
identity, so alternate spellings keep the same order. With repository
declarations or a target registry, an unregistered foreign directory selects
no order; `status --json` then refuses with a nonzero exit. A passing final
review binds the clean target commit and its review gate, linting only the commits
from the subject's merge base with the clone's fetched base-branch ref
(`refs/remotes/origin/<baseBranch>`) when the activation base is its ancestor,
otherwise from the activation base; review does not fetch, and an absent ref
keeps the activation-base range with the absence named in any refusal. Reports are drafted
in the launchpad; `resume target-records` copies the order and moves its
decisions and filed reports into the target's `documentationRoot`, retaining
control state, raw evidence and links in the launchpad.
The moved-record readers check the ignored clone mapping in the running
launchpad checkout, then the primary checkout whose Git directory is the
common Git directory, then a worktree on `main`. The primary checkout may
hold any branch; keeping the mapping there lets secondary update worktrees
run their gates and regenerate meta artifacts. With no mapping in those
places, the refusal names all three and the required arrangement.

`dotln.config.json` at the launchpad root declares schema `version: 1` and the
optional sections `roots`, `classes`, `repositories`, `build`, `release`, `kit`, `derivedOrders`, `portfolios` (§Declaring a portfolio), `historicalWorkOrders` and `contributions`. **Its absence
means today's layout, byte for byte**, with no pre-control historical order and no
contributor sign-off exemption, so `status --json`, `current.md`, the generated
index, `times`, `usage` and a release manifest derived over the real log are
unchanged by its introduction. This repository ships the file with
`historicalWorkOrders` naming `WO-001` and `WO-002` and `contributions.operatorAuthor`
naming the operator's public author identity, and no other section (WO-218); an
exported instance declares its own pre-control ids and exemption or neither, because
the kit supplies none. `historicalWorkOrders` lists distinct `WO-NNN` ids that the
index shows as historical and that no typed dependency may name as hard or
satisfied. Historical planning judgments use that declaration at their recorded
revision; an absent list remains empty. `contributions.operatorAuthor` is one
`Name <email>` identity the
contribution check exempts from sign-off, never read from Git configuration.
`kit.applyInstanceActions` defaults to false; true permits `launchpad export --update <dir> --apply` to perform the kit's declared instance actions.

`roots` maps a root name to a relative POSIX path inside the launchpad. The
names are `docs` (the document base), `control`, `orders`, `workOrders`,
`verifications`, `finalReviews`, `evidence`, `releases`, `planning`,
`refutations`, `derivedWorkOrders`, `publication`, `intake`, `workstreams`, `lineage`, `product`,
`discovery`, `observations`, `decisions`, `siblings` and `repositoryProfiles` (default
`docs/repositories`). An undeclared root defaults under
the document base — `orders` under `control` and `refutations` under `planning`
— with `derivedWorkOrders` under `workOrders/derived`, so moving a parent moves
its children unless the launchpad moves them too. `derivedOrders` declares
`first` and `last` as inclusive `WO-NNN` bounds, defaulting to `WO-900` and
`WO-999`; reversed or malformed ranges refuse.
`repositories` is an object keyed by a public repository id. `self` is implicit
and cannot be registered. Each target value declares `baseBranch`, a relative
POSIX `worktreeParent`, a `repositoryClass` naming an entry in `classes`, and a complete
`authorityProfile` in the domain model's `AuthorityEnvelope` shape. The loaded
entry carries its key as `id`; no absolute repository or worktree path belongs
in committed registration. Unknown entry or envelope fields and malformed
effect patterns, limits, expiry or revocation predicates refuse with the
configuration path. `build` carries the launchpad's saved `loadout`, `profile`
and instance `overlay`, and `release` carries the surface toggles `readmeBlock`,
`componentVersions`, `corpus` and `publicationCheck`. Version 1 validates and
exposes these sections; the orders that own `build` and `release` consume
them. `release.displayName` supplies the release claim's name, defaults to
`DotLn`, and admits at most 64 UTF-16 code units of well-formed Unicode.
Historical release recognition keeps its existing name-shape contract.

`classes` maps each class id to `{ checks: string[], supports: string[] }`.
The host adapter unions checks into each member order's compiled
`requiredEvidence` and equips its declared support ids in the existing link
group. Checks must already be declared by the launchpad's active WorkOrder,
authority envelope or support definitions; unknown checks or supports and
support authority widening refuse with `CLASS LAYER: <id>`. The existing
compiler support floor stays binding; the exact-grant exception below belongs
to registered profile allowances. Composition is additive: launchpad → class → repository, with no check-removal operation.
An earlier registration supplies an empty declaration for its class when it
needs no shared checks or supports.

A registration may name a launchpad-relative `profile` document, conventionally
under `repositoryProfiles`; the [profile convention](../repositories/README.md)
covers its purpose, demonstrated standards, commands, startup, branch and
pull-request policy, pinned upstream references and optional `dotln-discovery`
block. The executor reads it on demand for the order's `Repository:` id, never
at cold start. Repository conventions prevail over its class's where stated;
prose cannot relax the authority floor. Activation checks only that a declared
path is a readable, contained regular file, naming it on refusal. No declaration
activates with one missing-profile advisory. The registration may also declare
`automationLogins` for machine accounts and `linkHosts` for automation's links;
both default to empty. The target request carries them to the observer: named
accounts join bot-type authors as automated review, and their comments may link
to these hosts beside the forge host. Other screening, triage and verification
remain unchanged; a declaration confers no trust. The direct observer accepts
`--request <target-request.json>` alongside its store and number to load them.

A target work order adds exactly one leading metadata line,
`**Repository:** <id> @ <base-commit>`, where the base is a full 40- or 64-hex
object id. Absence remains the byte-compatible `self` case. Activation resolves
the id through the launchpad configuration and records only `repositoryId` and
`baseCommit`; the current-state Markdown, JSON status (including its orders
list), and generated work-order index project the same pair. The configured
worktree parent and every other physical path stay out of those records. An
unknown id, missing base, malformed object id or malformed registered profile
refuses before the activation event.
An optional leading `**Workstream:** WS-NNN` field groups the order under a
matching document in the configured `workstreams` root; the index validates
its JSON membership block and records target facts for the board, with
`track: separate` members outside the serial queue and `self` for an absent
Repository field ([convention](../workstreams/README.md)).
A closed member without the field is admitted from that document with an
advisory; open members still require it. A self member's base and integration
target both read the launchpad's `refs/heads/main`, so it remains `current`,
stale `no`, when refreshed from a planning or update branch. Adding one exact
leading `**Workstream:** WS-NNN` line to an order whose filed amendment source
lacked it preserves the amendment binding. Bindings a previous release made
with that field already present also remain matched; other changed bytes
remain bound under either representation. Both field representations are
checked for every historical title format, including activation-placeholder
bindings.
A field-only grouping change on a judged order still uses `amend-order` to
record its authorization; that binding retains the field. Release-title
assignment or retiming alone still needs no amendment.

The host compiles a registered profile through the existing monotone authority
floor. Profile denials and its expiry, resource, evidence and revocation
constraints narrow the active base; repository evidence also joins the
WorkOrder without removing class checks. Exact profile allowances outside either
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

A worktree's gate judges only what its branch can see, records the shared refs it saw at start and end, and names those that moved since its previous run or during the run when a task fails ([WO-198](../work-orders/WO-198-a-worktree-gate-names-what-moved.md)).
An earlier row with a missing or malformed snapshot, or a failed history lookup, supplies no comparison baseline; neither blocks recording the failed gate, and valid start/end snapshots still report movement during that run.
A clean unresolved branch read records `absent` and participates in comparisons; a failed shared-ref read records `unreadable` rather than a partial count, withholds only its own field's comparison, and never changes the gate's result, row or summary.

Each work order's implementation and verification progress independently of every other order's phase [[WO-041 breakout](../evidence/WO-041/ideation.md), 2026-09-07]. Do not require another lane to finish, verify, merge, or release before these transitions. A published dependency needed to implement a feature is still a real input dependency; paired-wave barriers and a verifier-reserve rule tied to the number of waiting orders are not. Actual available actors and one writer per worktree bound resource use. Two work orders run in parallel worktrees as a matter of course: the sequence is ordered in lane pairs whose orders name disjoint primary surfaces and share no hard edge [[R1 replan pass](../planning/r1-replan-2026-09-16.md), 2026-09-16]. The second lane is by preference an evidence-only or machinery order that touches surfaces the delivery order does not, so its integration has no release retime and no source merge; two operator-assisted orders never share a pair [[vision-into-use pass](../planning/vision-into-use-2026-09-17.md), 2026-09-17].

The operator voluntarily takes one order from final review through PR, merge, and release close before bringing another into final review. Preserve that discipline in handoffs; it is not an enforced cross-order transition gate. It leaves other orders free to implement and verify during that window. A gate for this final-review window is an open option, not authorized implementation. The integrating final-review session owns routine integration within its window, without requiring the operator to arrange earlier sibling phases.

Verification judges its recorded subject. When upstream moves, the integrating actor owns the merge and an explicit assessment of which acceptance claims, if any, changed. Incorporating independently reviewed upstream work, regenerating projections, reconciling additive documentation or independent manifest fields, and retiming an unpublished release under its existing classification are permitted final-review integration work when they preserve behavior, contracts, authority, and acceptance. A new base, a sibling's publication, a text conflict, a changed whole-tree hash or a version collision alone is never a failed review, a finding, a repair or a new verification; a verifier who meets one records it as an observation for the reviewer [R1 replan pass, 2026-09-16]. Preserve every original report and source revision; the final report names both bases, resolved paths, carried-forward claims, and checks on the integrated result. It must not pretend an old verdict judged new bytes.

Run the affected executable checks and release/publication preflights on the integrated tree. Feedback evidence uses its declared dependency projection, so workspace release versions and license labels do not demand another live audit. Source, executable configuration, dependency, contract, or acceptance changes still need evidence for the claims they affect. If an integration resolution requires new behavioral code, or a check reveals an actual acceptance defect, return that bounded finding through repair and fresh independent verification; unchanged claims are carried forward with their original evidence. A reviewer never writes a behavioral fix and certifies it. Integration bookkeeping alone must not create a new `VER-NNN`, a failed `FINAL-NNN`, or a repair event.

The existing resume phrases remain the operator interface. The actor performing a handoff completes authorized integration chores within that session. `npm run release -- prepare` handles a colliding target, the README claim, and the integration decision under the recorded release classification. It uses origin's tag observation; `--local` deliberately uses only the fetched local tag snapshot. It never publishes, alters component versions, or appends control events. A missing component bump against the verified branch baseline remains an executor defect. A component bump that was valid at verification may be retimed during integration if upstream consumed the same version, preserving its already-declared compatibility impact and recording that evidence; this is distinct from omitting the original bump. `npm run test:docs` runs `check-surfaces --local` as a preflight against annotated local releases in the subject's own `HEAD` ancestry. Worktrees share tag refs, so an unintegrated sibling's newer tag is excluded from this verification baseline. `worktree publish` / `release close` retain the authoritative remote check on the integrated result. No command acquires authority from a sibling's phase.

Run `npm run worktree -- integrate WO-NNN` inside the matching worktree
([WO-079](../work-orders/WO-079-worktree-sync.md), the successor to WO-033's
sync proposal). It checkpoints current work without a lifecycle event,
keeps a named include-untracked stash, fetches main and tags, fast-forwards
an uncommitted branch or starts a non-rewriting merge, applies the stash,
and regenerates the projections below. Ignored intake requires
`--intake-backup <archive.zip>` naming an external archive whose bytes match
the current intake; `npm run backup:intake -- <authorized-directory>` creates
one. The helper is admitted in `repairing` and `final-review`, records that phase,
makes its preservation recovery commit and any necessary merge commit with
hooks disabled through invocation-local flags, and records both identities in
the integration receipt. It never reads a sibling's phase as admission authority.
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
the stash is never popped or dropped. If application was interrupted at stage
`applying`, inspect and complete the application, stage resolved content, and
use `worktree integrate WO-NNN --continue --stash-applied`; this attestation
still checks conflicts, restored untracked files and upstream ancestry. The
stash-drop helper publishes a whole recovery snapshot atomically before changing
the ref and reflog. A stopped helper retains its locks and snapshot; its named
remedy requires checking for a live Git process before removing stale locks,
and restoring both the ref and reflog when they disagree. A clean-tree continuation adopts only
the stash named for this integration and its original base; ambiguous matches
require explicit inspection. The helper commits a resolved divergent merge
before applying the stash, retaining uncommitted work for the current role. An authored
conflict delays generation, and a reviewed branch's stash application, until that continuation.
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
and reviews the helper-recorded merge commit. The helper runs no product gate and records no
repair, verification or acceptance event. A new base is not itself a finding.

The integrating final review runs this list and nothing else counts as a
finding: preserve the branch's work and intake; merge main; regenerate the
harness bundle and manifest, the work-order index, `npm run meta` and the
publication locks; union the follow-up register by entry id; retime an
unpublished release under its recorded classification with a dated decision
record (a version collision is bookkeeping); re-run the affected checks and
the one product gate on the integrated tree; and record both bases and the
carried-forward claims in the final report. A step this list does not name
is the reopening observation for this rule [R1 replan pass, 2026-09-16].
`npm run worktree -- integrate WO-NNN` runs the list's mechanical steps and
prints the affected checks; the list remains its definition. A final review
records a merge blocker only with the command and line that enforces it; a
sentence nothing checks is a documented condition, not a gate
[vision-into-use pass, 2026-09-17].

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
from measured passing verification. General lifecycle reconstruction and live
process handling remain planning choices; the recovery event shape is closed
by the routes below [[off-ramps pass](../planning/off-ramps-5s-entropy-2026-09-25.md)
§3–§4, 2026-09-25]. The unconditional entry commands are WO-131 scope; this
general helper is a preserved requirement, not a claim of implemented recovery
for every corrupt repository. Source and review duties: [WO-131 ideation receipt](../evidence/WO-131/ideation.md).

Each of the four routes below is a `resume` command that appends its typed
event with the actor attestation and a recovery checkpoint (except the closed-order
pending route below), refuses outside its legal phases with
those phases and the lifecycle's legal commands, and projects in `status --json`
(`legalOffRamps`, `waivedCriteria`, `withdrawal`, `corrections`,
`overrideRecords`), `current.md` and the work-order index
[[WO-158](../work-orders/WO-158-lifecycle-off-ramps.md), 2026-09-25]. The
fold validates each event's shape; the route judges its legality.

- `npm run resume -- waive <criterion> --reason <text> --capture <path> --capture-hash sha256:<digest> <actor-flags>`
  appends `CriterionWaived` in `verifying`, `needs-fix`, `repairing`,
  `verified` or `final-review`. The capture is an ignored, untracked file under
  the intake root holding the operator's words, checked against the stated
  SHA-256 (the `plan override --capture` shape); the criterion must be one
  the order's acceptance criteria number. The order's executor is refused:
  any session variable of the command (`CODEX_THREAD_ID`,
  `COPILOT_AGENT_SESSION_ID`, `CLAUDE_CODE_SESSION_ID`, `CLAUDE_SESSION_ID`)
  naming an executor journal for the order, or a live writer reservation held
  by one, which the command's environment cannot rename. The event records
  the recording session's role and whether the capture file was created
  during that session. A waiver changes no phase and neither passes nor
  fails a criterion: a report judges it on a
  `**Criterion <id>:** unmet, waived by <ordinal>` line, and
  `verification-result` and `final-review-result` refuse a pass over an
  unwaived `**Criterion <id>:** unmet` line, a waiver the log lacks, and an
  `unmet` line that omits the waiver the log holds.
- `withdraw --disposition failed|superseded|abandoned --reason <text> --capture <path> --capture-hash sha256:<digest> <actor-flags>`
  appends `WorkOrderWithdrawn` from any phase but `closed` and `withdrawn`
  (from `none` only for an allocated order) and records the authority's
  SHA-256 and the digests of its existing reactivation notes. Phase
  `withdrawn` claims no success and is terminal: its one legal action is
  `npm run resume -- activate <id> <path>` in place, which requires a changed
  authority carrying a new `**Reactivation (YYYY-MM-DD):**` note dated on or
  after the withdrawal, on a calendar date (VER-001 F1 reactivated with
  `9999-99-99`; the digit shape alone is not a date). A withdrawn order is settled like a closed one: it is not open,
  carries no completion, gate-attribution, meta or resident-binding duty, is
  listed unchecked in the proposed order and under the Withdrawn section of
  the index's history page with its disposition, and
  the sequence topology check skips edges to it. A typed dependency on it is
  `unmet` with `detail: withdrawn`, because it never closes as filed. The v2
  control beacon has no withdrawn phase, so the order's previous beacon ages
  to stale.
- `correct <ordinal|report-path> --set <field>=<value> [--set ...] --reason <text> <actor-flags>`
  appends `RecordCorrected` for `model`, `effort`, `source`, `harnessVersion`,
  `reportPath`, `checkpointRef` or `checkpointSha` of an event in the current
  activation. A verdict is never corrected (a later `VER-NNN` or a failing
  final review is its route) and no report byte changes. A recorded result
  carries `reportHash`, the SHA-256 of the report it judged; a report path
  moves only on a recorded result, only to a normalized path of the same
  report id, and only to a file holding those bytes (for a result recorded
  before digests, the bytes at its current path), so a verdict never rests on
  another report (VER-001 F2 rebound a pass to a different `VER-001.md`).
  The correction records the digest it checked. A correction never records
  `claude-session-readback`: only the session that appended the event read
  its `CLAUDE_EFFORT`, so an effort correction on such an event also sets
  `source operator-attested`; `ultra` spellings correct to `xhigh`. The fold
  projects the corrected attestation with `correctedBy`, and a report path
  names the event whose corrected path it is. A completion whose effort disagrees with a readable
  `CLAUDE_EFFORT` is refused with the readback value
  ([WO-157-D027](../evidence/WO-157/decisions.md#wo-157-d027)); an absent
  readback refuses nothing.
- `override-record --bypassed <items> --effects <items> --reason <text> [--capture <path> --capture-hash sha256:<digest>] <actor-flags>`
  appends `OperatorOverrideRecorded` in any open phase. For a closed order,
  run it from the main control-plane checkout: it writes the event to the
  ignored `local/pending-overrides/` directory under main's configured control
  root, leaving tracked control and projections unchanged. A linked checkout
  refuses before writing and prints the command to run from main; a supplied
  capture must also exist at its ignored intake path in main with the same hash.
  The next `worktree start` appends each validated record to its original closed
  order's control segment in the new worktree and regenerates the projection
  there. It removes only unchanged carried records after that refresh.
  A malformed or unreadable pending lane stays in place with a named advisory,
  and start proceeds ([WO-219-D050](../evidence/WO-219/decisions.md#wo-219-d050)).
  Claude's session hook uses the same command for an open or closed selected
  order at `operator override: off`, with
  `--bypassed dotln-hook-enforcement --effects unobserved` and a capture of
  the operator's own prompts during the override, retained in the
  session-local operator-control state. Each capture is created exclusively;
  a second exit in the same second takes the next numbered name, so every
  record keeps naming the words whose digest it stored (VER-001 F3). At a closed selected order the hook's receipt names the pending record and that the next `worktree start` carries it, and it directs the role to record what the override changed with a further `override-record` from main, never in that order's decisions ([WO-219-D081](../evidence/WO-219/decisions.md#wo-219-d081--repair-the-closed-order-hook-receipt-and-effects-route-at-final-review)). When the pinned runtime cannot load,
  or a live gate or another writer refuses it, the hook prints the exact
  command and the role's completion carries the duty; for a withdrawn or
  unselected order the override and what it changed go to the order's decisions
  instead. Codex's `node scripts/operator-control.mjs off` prints the same
  route advice, including the main-checkout and capture prerequisites for a
  closed order. The record is never a precondition for
  entering or leaving override.

Declined: a verdict-changing correction, one generic exception event, an
override record as a precondition, and rewriting a closed order's existing events.
Whether the operator waives WO-111's criterion 2 or withdraws WO-111 is the
operator's call. See [the WO-158 decisions](../evidence/WO-158/decisions.md).

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

**Applying a correction.** A correction points at a category [operator
definition, 2026-09-09]. Two failure modes: sweeping generalization, which
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
   `docs/intake/notes/`, or `docs/intake/images/` of the current checkout. A
   worktree's capture is staging: the reviewed closeout helper copies it into
   main's ignored intake at removal (WO-044), so no session writes outside its
   worktree for a capture; name the pending reconciliation in the receipt
   [2026-09-30 pass, WO-116 D014]. Intake is local-only and gitignored; preserve fragments, repetition,
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

The same planning commands run in an exported instance using its own records, with absent core inputs named explicitly ([fixture evidence](../evidence/WO-202/commands-final.json)).

A message prefixed `planning:`, or an explicit instruction to run a planning
session, dispatches a planning pass. It is the step the playbook calls “Plan
(Fable, main checkout)” made explicit, and it is distinct from the other two
things an operator might reach for: the Entropy Reducer is a compiled review
loadout dispatched separately against a frozen subject, which returns findings
and non-authoritative suggestions, goes through blinded refutation, and stops at
operator disposition without planning or fixing; the Repo Gardener is the
walking skeleton's founding identity, not a session.

The prompt hook reads a dispatch from the first non-blank content line,
skipping one leading triple-backtick fence and surrounding blank lines. It
records that line's zero-based `prefixLine`, prefix, class and resolved role;
a prefix on a later content line is not a dispatch. Quoted examples remain
prose, and one message records at most one prefix (WO-226).

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
queued for a later pass to read. A finding half that a standing operator
direction reserves for the operator's own pass stays recorded against that
direction rather than overruled [REVIEW-002 pass, 2026-09-22]; a cold-start
byte ceiling is no longer one (§Discipline's cold-start ceiling route). The generated
`docs/planning/entropy-reviews/REVIEW-NNN.md` rows and the follow-up register
are the durable record of what this pass decided; an item left undecided there
is an ordinary unresolved register row, not a second planning pass waiting to
happen. The phrase is itself the operator request that authorizes the external
CLI launch of the pinned reviewer and its refuter, and it adds no scheduler:
nothing runs a review unless the operator opens a pass this way. A pass opened
any other way may still consume an earlier review's surviving findings as one
input among others. The subject defaults to the launchpad. A trailing
registered repository id in `planning: entropy reducer <id>` selects
`subject --repository <id>` and `review --repository <id> [<commit>]`;
a trailing workstream id selects `subject --workstream WS-NNN` and
`review --workstream WS-NNN`. The target defaults to its clone's already
fetched base-branch tip. A workstream dispatches one distinct member at a
time, with each receipt filed separately and all survivors disposed in this
pass; `self` includes the launchpad at a named commit. Selected subjects
report a needed refutation or remaining dispositions before another review;
a completed set reports `complete`, and a later explicit review starts a new
sequence. The same pinned reviewer, blinded refutation, immutable launchpad
receipts and register disposition apply. Episode cost is paid once per
repository: the REVIEW-002 observation above is about 993 s and USD 9.50
for one episode, not the whole workstream. Consumptions: [[REVIEW-002 pass](../planning/entropy-review-002-2026-09-22.md),
2026-09-22]; [[off-ramps pass](../planning/off-ramps-5s-entropy-2026-09-25.md)
§9, 2026-09-25]; [[REVIEW-006 pass](../planning/entropy-review-006-2026-10-10.md),
2026-10-10: one order from one finding, one product sentence from the other];
[[REVIEW-007 pass](../planning/entropy-review-007-2026-10-20.md),
2026-10-20: no new order, both findings to WO-219 as steps, one of them a
guard on the review machinery itself].

Preconditions and inputs:

1. Run on the clean main checkout. Between work orders is the normal case; an
   active order is context, never a scope fence, exactly as in ideation mode.
   Run `npm run plan -- start <slug>` before the first planning write. It
   requires clean main and creates `planning/YYYY-MM-DD-<slug>` through the
   classified command path; unknown tool effects are advisory and host permissions decide. It also
   returns the first bounded page of the public follow-up register. A stale
   register refuses entry before creating the branch; refresh it with
   `npm run meta` and include that document update in the preceding checkpoint.
2. Read `npm run plan -- failures`; route each failed report's cause in the pass.
   `plan start` counts local closes, denials, interventions, long phases,
   repeated gates and eight recent closes' tracks (WO-178).
   `plan start` counts numeric reopening conditions; `npm run plan -- conditions`
   lists them without refusing entry (`--slow` for gate timings, WO-175).
   Read the deferred register rows whose reopening condition opens with an
   order's lifecycle event against the control phases and re-dispose each
   fired one in the pass: the REVIEW-005 and REVIEW-006 passes each found
   fired triggers the pass before had left (FUP-0086 and FUP-0113 on
   2026-10-02; FUP-0044 and FUP-0091 on 2026-10-10).
   Read canonical status, [the sequence](../planning/sequence.md), and this
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
   A standard pass files an order only for a reopening condition that has
   occurred or an operator direction, and disposes every other row it reads
   ([2026-09-27 pass](../planning/onesie-twosie-followup-drain-2026-09-27.md#13-the-operators-answer-decisions-made-under-delegation)). 
4. `ideation:` entries in the same dispatch run the complete ideation pipeline
   first; their synthesis is planning input.
5. An instance's observations and requests arrive as the pasted block its
   own planning pass writes for core (its §Requests to core), one block per
   instance pass that has items, until WO-193 carries them as filed requests
   (operator question, 2026-10-21: the cadence is the instance's, and a pass
   with nothing to ask sends nothing). The pass reads each item against the
   record it names, files, declines or defers it with its reopening
   condition, and answers in a paste-ready block the instance's next pass
   reads; an item is evidence the operator carried, never operator direction
   (the 2026-10-20 and 2026-10-21 passes). When the pass files an order for an item,
   its answer says whether the item blocks the instance's next order, so
   the instance waits for the carrying release, or is a convenience with a
   working route today, so the instance continues; a release's Read before
   upgrading says what an instance must read, and nothing else obliges an
   instance to take it (operator question, 2026-10-22).
   When dispatching with a pasted block, put the dispatch on its first
   content line; one opening fence and blank lines are admitted, while a
   later quoted dispatch does not select a role.
6. GitHub issues on this repository are the external idea intake (operator
   direction, 2026-10-24): the operator or an autonomous agent files an idea
   as an issue, and the pass lists the open issues (`gh issue list`), reads
   each against the record it names and files, declines or defers it with
   its reopening condition, as it does a fork item; the idea ledger is
   drained into the operator's instance's UI, where an idea lives first as a
   toy, and is not fed new entries by this route.

**`planning: refute` and `planning: refute full`.** These exact phrases load
the dedicated refuter skill in either harness. The parent runs
`npm run plan -- refute` (add `--scope full` for the whole horizon; `--direct`
remains an alias). The command verifies the committed subject equals the
workspace and prints the canonical prompt and closed JSON schema. The parent
spawns one fresh background worker without inherited conversation, supplying
only that prompt and the shared goal card. In Codex this uses `spawn_agent`
with `fork_turns: none`; in Claude it uses the generated `dotln-worker`
type pinned to `claude-opus-5-5` at `xhigh`, without a model override
(or `dotln-worker-fable` only on the operator's dispatch, §Model-specific
notes). The worker
judges the supplied prompt directly, returns its frozen JSON and a truthful
single-line statement of at most 4000 characters, and makes no repository or
Git writes. The parent remains the sole writer and can finish independent
closeout work while waiting without changing the frozen subject. Save the
worker's judgment and statement in ignored local files,
then run `npm run plan -- receipt <result.json> --statement <statement.txt>`
with any required `--dispositions <file>` and `--worker-type
dotln-worker-fable` when that type ran (the default is `dotln-worker`);
Codex uses `--worker-type codex-spawn-agent`.
The response and receipt record the worker type as the parent's launch
attestation, separately from unavailable effective model/effort. The helper validates, screens,
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

After the refutation receipt is filed with its holds answered and
`npm run test:docs` is green, a planning or ideation pass on a planning branch
pushes that branch and opens its `:memo:` pull request. The dispatch phrase is
the operator's authorization for those two effects; the pass never merges.
A target-scoped pass publishes its product and planning files with `plan
target-publish` under the registered profile and operator grant, then records
the printed repository, commit and paths in its own planning document.

The refuter's platform-first standard is the operator's direction of 2026-09-12: the point is to create a platform, not to prove every
constructible case before filing, and the refutation pass must be made worth
its cost before a later pass pays it again. New judgments use `aligned`,
`aligned-with-findings` and `misaligned`. Only misalignment supported by an
observed failure or a supplied vision passage holds. A constructible counterexample is a known issue with a concrete
reopening observation. Each judgment answers critical-path and NoOp cost,
all eight system traps, removal balance, and failure behavior. Missing cost
observations remain unknown.

In an exported instance the refutation goal standard composes the guide's
marked `dotln-goal-rules` blocks with one nonempty `dotln-purpose` block in
`docs/product/purpose.md`, or names that purpose unavailable when absent.
The instance declares that contained regular file itself. Malformed markers
or a malformed declaration refuse; core's purpose and critical-path sentence
are not substituted. Core's whole-section standard and historical subjects
keep their bytes and meaning.

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
Neither is a fresh planning verdict or a way to discharge an independent hold.
This route requires an order in the latest judged horizon. A never-judged
seed order has no receipt to amend: record the actual operator authorization
and bounded change in its structured decisions, then run the ordinary
planning, document and lifecycle checks. That record grants no extra
authority and supplies no planning verdict or hold disposition. A dated
planning pass missing a required receipt must still complete normal
planning/refutation; never fabricate a pass merely to enable amendment.
Do this during authorized execution rather than carrying an
inherited failure through later reviews [WO-139-D002, the WO-053 amendment,
2026-09-18]. An authorized status writeback to
product 00's The one-paragraph story can be bound in that decision's optional
`executionWritebacks` array: one entry names `path`, `section`, `criterionId`,
`criterionHash`, `sourceHash` and `acceptedHash`. The criterion hash is SHA-256
of the exact reviewed criterion text; the section hashes are its reviewed and
accepted planning-input hashes. The current amendment must bind the decision
and order, and the named criterion must remain unchanged. Only those exact
story-section bytes continue; other planning inputs retain their checks.
Changing accepted bytes requires rebinding through `amend-order`. The gate
reads a writeback only from the order's current amendment, so a later
amendment of that order restates it. This is
reported separately as `authorized-execution-writeback` [WO-118-D004 and D007, 2026-10-13]. If committed execution overwrote an existing capability row, restore the judged
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
- for an ideation batch, one dated ledger section; a planning pass adds only
  a dated registration heading that links its planning document, because the
  plan tooling still finds passes by their ledger headings, until WO-088 moves
  registration out of the ledger (the idea ledger holds the operator's own
  ideas; operator direction, 2026-10-13);
- the sequence revision, from which closed entries leave at each pass (the
  Closed section of the generated index's history page is their record) [REVIEW-002 pass,
  2026-09-22], and scoped map rationale, tracks, preflight, candidates,
  catalog rows and provenance;
- a blinded refutation receipt pair under `docs/planning/refutations/`,
  produced by `npm run plan -- refute` or the direct-session form, with all
  holds answered through the checked disposition chain or attributed
  override events;
- zero or more planner-synthesized work-order drafts, each with `Model:` and
  three-role `Effort:` lines, a `Cost:` header naming additions and removals in
  wall-clock, context bytes, commands, tokens and steps, provenance, a dated
  observed gap, acceptance criteria whose last names both `npm test` and
  `npm run test:docs` [off-ramps pass, 2026-09-25; WO-111 VER-001 B3],
  a Preflight line spelling each single-suite check as
  `npm test -- --only <suite>` for its steps; these suites and the
  structural phase are the order's handoff gate (a target order keeps its
  repository's declared target gate), with the complete gate paid once at
  final review (§Preflight before the full gate), a Design naming at
  least one rejected alternative and the axis it differs on (2026-10-17
  pass), evidence, non-goals,
  and operator-review assumptions; an order
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
  version-only bump never makes an edition stale); an order that edits a
  declared source of a machinery suite (`machinerySources` in
  `scripts/test-runner.mjs`) names `npm test -- --review` in its final
  criterion: handoffs use the declared Preflight suites and final review
  runs the complete review selection (WO-144 D010; WO-216);
- product-doc write-back for durable understanding, with the publication
  index and edition locks repaired in the same pass;
- `npm run meta -- --plan-cost` refreshes the bounded, subject-hashed cost
  table after the subject revision. It carries latest meter rows and trap
  signals. Stale or missing observations are labeled; cost shortfalls become
  planning input and never create an automatic structural hold;
- `npm run work-orders -- index` regenerated and `npm run test:docs` green.
  A document-only pass runs no code suite.

An acceptance criterion says what a write-back states and where, without a
byte count; a figure in an order filed earlier is the planner's estimate, never
a bound a role trims reviewed text to meet [2026-09-30 pass; WO-172 theme 14].
Ceilings are planning's alone [operator direction, 2026-10-07]: every pass
sets each product document's ceiling (`docs/control/doc-ceilings.json`) at
its measured non-exempt bytes plus one tenth, citing its planning document;
the document check reports an overrun as an advisory that the next pass reads
(mechanical once WO-196 lands); no role trims reviewed text to a number and no
review asks the operator to settle bytes. When the operator makes bytes a goal and boards an overrun,
the entry may name an `advisoryDecision` in public evidence with a current
unresolved registered follow-up; the check reports the exact overrun without
raising its ceiling or exempting bytes. Remove that reference when the useful
text fits. A duty an order owes beyond its criteria (a carry-in, a
boarded item it takes, a known issue an earlier receipt named) is written in
that order under `Known issues and carry-ins`; a known issue from the pass's
own receipt, which finds the order frozen, goes on its catalog row until a
later pass amends the order [2026-10-02 pass].

An order gives the executor every step the executor can perform (operator
direction, 2026-09-28): none is marked operator-run or routed to the
operator. A live feedback episode an order owes runs in the executor's
session on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at
`xhigh` (the spawned-agent rule of §Model-specific notes), with no operator
authorization and its cost accepted; a repair that edits a
judged source again runs another the same way. A step the order's objective
gives the operator (a session the operator witnesses, a run in the operator's
own fork, a grant only the operator's account holds) names its fallback for
the case that it has not happened by handoff.

An order carries an `Execution plan`: numbered steps in execution order,
each naming one file (existing, with the function or export it changes, or
new, in a directory that exists or an earlier step creates), the change, and
the command that checks it; write-backs last, each with the section heading
as it reads today; then the handoff sequence of §Discipline. A step that
cannot be written until another order merges says so and names what will be
known then. Two screens before filing [2026-10-07 pass]: an order that says
no code ships is checked against every cited design for work assigned to it
("a model episode in WO-NNN", "supplied by WO-NNN") and against every
criterion that needs capability the tree lacks (WO-112 D018: planned as
evidence-only, it needed four code repairs under override); and no criterion
requires a deterministic reading of natural language or free-form Markdown,
which includes counting its sentences (WO-189's criterion 5 cost three failed
verifications on 2026-10-10 before a line count replaced the sentence count).
A classification of wording is a persisted judgment supplied as input; a
record inside a document is a marker block holding JSON or a typed field.
WO-123 (criterion 5, four repairs) and WO-187 (criteria 2 and 4, four
repairs) spent 39.9 hours between them before each reader was replaced by a
structured input. Two more screens [2026-10-13 pass]: verification judges
each criterion as written, so a scope decision recorded in a Design, a step
or a known issue is written into every criterion it narrows, and no step
contradicts a criterion (WO-118's VER-001 failed criterion 4, whose phases
step 7 had moved onto receipts while the criterion still required the
console to show them); and an order whose criteria need a live run names, at
its base, each surface the run must show, write or traverse, and whether it
exists and has been run (WO-118 needed three mid-run scope amendments for
four such surfaces, and WO-083's publication step named a command that publishes only a
source-change episode). One more [2026-10-19 pass]: a criterion names the
behavior a host's configuration form must give (the admitted command, the
removal at close) and cites the published host page it was read from; the
form itself (a settings key, a marker, a rules file) is the executor's,
read from that page at execution, so a host that documents a different
form costs no failed verification (WO-221's criteria 2 and 3 fixed a
marker and a `config.toml` form the hosts do not support; VER-001 failed
them as written and D028's operator amendment replaced them). One more
[2026-10-20 pass]: a criterion that settles a boarded row by a case that
fails without the fix names the control, the case run with only that
row's fix reverted and recorded with both arms' exit codes in a replayable
file, as WO-218's repair recorded its 91 controls after VER-001 found three
named cases passing at the base; a case that also passes at the base, or
with the fix reverted, settles nothing. One more [2026-10-25 pass]: an order
that changes which commit a lifecycle step computes from (a base, a merge
base, a revision) names every reader of that field across `scripts/` and
`packages/` in its Observed gap, each kept or moved with its reason (WO-230
moved the publish's three reads to the described base and left
`lintReviewedTargetCommits`, the fourth reader, on the activation base; the
DotLn-Angular fork's WO-013 FINAL-002 was refused on two merged subjects the
day the release landed, and WO-231 moves it). A release's Read before
upgrading is also screened: it asks an instance to read, never to edit a
closed record by hand. A new or tightened kit check must admit records the
previous release admitted, or the release is held; the `instance-history`
suite checks that compatibility before release (WO-232). Order size
[2026-10-13 pass, operator direction]: the 2026-09-08 cut (one seam and one outcome per order,
split again above four hours) was a correction for its time and no longer
binds. The binding cost is now the full gate run and the fixed cycle every
order pays (activation, verification, final review and release close). A
pass weighs filing a chain of orders on one subsystem, whose members would
run one after another, as one order with one outcome. That order pays the
cycle once and owes one live feedback episode and one re-mint where any part
owes one, against a larger first verification. Unrelated subsystems are not
bundled to save runs. Each order names its Preflight line. Parallel orders stay the aim
where they pay (operator direction, 2026-10-13): two orders run side by side
when their surfaces are disjoint, no hard edge joins them, and the operator
will run both at once. Final review reuses the passing complete row at the integrated code
identity and pays a fresh run only when the identity changed (§Preflight
before the full gate; WO-221 D017 restored this reading on 2026-10-18); a
pair whose second member integrates a sibling that moved its identity
therefore pays one fresh run at final review, which WO-078 measured at 22.9
minutes. That is less than the implementation a pair overlaps (median 72.9
minutes).
Serial order is a pass's reading of its evidence, never a standing rule.
Reopen the order-size rule when the full run's median falls to half its 24.9
minutes, or when merged orders fail first verification more often than the
five-of-eight baseline (the 2026-10-13 planning document, §12).

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

`followups --touching [<path or WO-NNN>…]` lists the pending rows whose text
names a changed or given path or an order: the planner runs it before filing
an order, completion advises the executor with the count and the rule, and a
pass retiring closed orders names them; each use ends in a recorded
disposition, and the final review disposes a listed row whose seam the change
opened or whose condition occurred and leaves a row it only matched as it is.
`--export <file>` writes every pending row whole and `--apply` takes a batch
under one revision.

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

## Workflow closeout and releases

Final review publishes the reviewed work-order branch and PR; the operator
retains merge authority. After merge, `resume: release close` authorizes the
exact helper command printed by `resume release-close` in main or `worktree publish`.
Run main's helper with main as the working directory; retries use the same
updated main after the subject is removed.

Run the printed helper exactly as printed, with no redirect, prefix, `cd` or
pipe. For a matching dispatched order whose helper suffix differs, the
advisory names the expected `--publish` and `--dry-run` spellings and the
mismatch class: extra words or whitespace, a shell operator or redirect, or
non-canonical material flag quoting or value. The admitted forms stay the
same. Its stdout is a summary; the full output is retained beside
`release-close.json` and the summary names that report. A close is done when
the tag and Release exist, no worktree for the order appears in
`git worktree list`, its directory is gone and `git branch --list wo-NNN` is
empty, and no starter-refresh blocker remains. The lower-version no-release
outcome remains explicit. Diagnose and
finish cleanup blockers in the dispatched session; re-running the same command
re-checks an existing Release and never publishes twice. A retry after main moves validates the original annotated tag's commit,
manifest and order binding; later main commits do not retarget publication.
One close per order runs at a time. The latest receipt keeps eight inline
attempts and hash-named immutable archives; retries verify those archives
before using older publication or cleanup bindings. Failure to archive a parsed
attempt or read its referenced archives stops publication, retains the parsed
history and publication bindings, and keeps refused retries bounded. Restore the
named archive, or, after establishing it is unrecoverable, run the re-anchor
command printed by the refusal. Re-anchoring preserves surviving history and
records unavailable archive references without publishing or removing worktrees.
Retry a host denial of the exact
command once through the host permission flow before handing the operator the
printed command for `!`. A scratch repository, a nested repository outside
the intake lane that the tracked tree does not declare as a submodule, is
removed at close and recorded with its path, its head commit and whether a
remote held it; intake and declared submodules stay, an operator word through
`--material` preserves a scratch repository, and teardown is never forced.

The command proves origin reachability first, fast-forwards main, checks the
README release block, component bumps, notes profile and license pins, and
builds missing skeleton/kernel dist using installed dependencies. It consumes
the committed final-review event's passing `npm test` row. The reviewed source
and merged source must have equal code identity; the tag manifest records both
trees, the code identity, duration, time and evidence reference. It runs no suite,
`npm ci` or CLI smoke. Reports, control events, generated indexes, PR bodies and
release notes may follow the gate without changing its identity.

`--publish` first creates and pushes the validated annotated tag, then creates
its matching GitHub Release. The current human notes remain byte-exact from
review through tag and Release. Never move a tag, edit a published Release,
push core’s main or imply package/binary/hosted distribution. An equal target is an
idempotent retry only when the immutable tag names the same commit and manifest;
a differing Release body refuses without editing it. If Release creation fails
after tag push, rerun the same command. A lower target is an explicit no-release
outcome. A deliberately deferred eligible release needs a durable disposition.

**Starter refresh (WO-215).** After the tag and Release exist, the phrase
authorizes one further external effect: one verified commit pushed as a
fast-forward to `main` of each declared export sibling, bound to core’s origin
host and owner and the sibling’s name. Record its physical checkout once with
`worktree clone <sibling-id> <absolute-path>`; that path stays in the ignored
clone map. The helper checks the published head, checkout identity, branch,
cleanliness, remote binding and ancestry, then updates a disposable worktree
(or exports the kit for the first time). The export’s own emit, predicted
bundle comparison, harness check, kit verify and exact staged-file check run
before the hookless push. Before the branch push, an existing sibling tag must name the proposed
refresh commit or a proven prior refresh of the same core release. GitHub
availability and authentication precede the tag push. After the branch push,
core's release tag name is pushed
as an annotated tag onto the refresh commit through the same isolated lane
and the sibling's GitHub Release is created pointing at it, with a one-line
body naming core's Release, so a fork previews `--from vX.Y.Z`; a retry
finds both and reports current. On an already-current sibling with a missing tag,
the tag targets the earliest ancestor whose committed manifest names that exact
core commit and release tag. The tag's name is core's. A fork configures
`remote.upstream.tagOpt=--no-tags`, fetches with `--no-tags`, and previews a
named starter release through a non-tag ref. Local instance release checks
exclude annotated tags whose message begins `Starter <tag>` and binds a
`Core commit:`; ordinary tags reachable from the current `HEAD` still count.
Both `check-surfaces --local` and `release prepare --local` use that ancestry
boundary: worktrees share tag refs, so an unintegrated sibling release must
not retime this worktree. Integrating its history makes its ordinary tags
eligible; publication still checks origin. A tag at another commit refuses unless it is
an ancestor whose committed kit manifest names this exact core commit and
release tag, preserving the first tag through a seed-only refresh; ancestry
alone does not establish that provenance (WO-221). Direct template seeds are refreshed only when each
changed copy exactly matches a prior exported template, including its regular
file mode. Historical starter manifests and ancestor core templates prove the
baseline, including seeds left behind by kit-only updates. A custom edit,
missing path or changed type for a changed template refuses by path before
any push; preserve the customization and restore its prior exported template
through a reviewed change before retrying. An unchanged template preserves a
customized working copy without blocking unrelated kit changes; a copy of
`CLAUDE.md` or `.gitignore` the refresh itself could not use, missing,
non-regular, without its hand-written floor or with a broken marker pair,
refuses by path before any write, naming the remedy. The refresh row
lists rewritten seeds; an already-current manifest can still need a seed-only
refresh. First export preserves an existing committed configuration and renders
the new README with its release name. An ignored or untracked local configuration
refuses before publication; commit its intended declaration before retrying.
Generated control/planning records and opted-in instance actions
remain unchanged. A kit check added or tightened in a release must admit the
records the previous release admitted, or the release is held until it does.
The core-only `instance-history` suite updates a committed fixture instance
and runs its own sync, index, planning and document checks against accumulated
record shapes. A new field refusal reported by an instance adds a shape at
the next planning pass. A Read before upgrading line never asks an instance
to edit a closed record by hand; a necessary migration needs its own planning
decision before release. Ordinary instance kit updates still preserve seed ownership;
the instance's own session previews the refreshed starter with the incoming
revision's launchpad, merges it on an update branch, re-emits and generates
the lineage index there, and commits the regenerated files in that update
pull request. Before its named stash the session deletes a generated untracked
lineage index on main, which the update branch regenerates, so the stash later
restores every record into the order worktree. After the operator merges it
with a merge commit, the session fast-forwards main and bootstraps without
leaving generated tracked-path files uncommitted. A fork of a starter exported
before the index was seeded generates and commits the index with its setup
commit before its first document gate; the lineage check names a missing index
and the command that writes it. It preserves the instance's records and
recovers an already
verified main activation into its order worktree. A missing release-block
remedy follows that update first and adds the block only if still absent.
The operator uses phrases and merges
pull requests; the session executes the update and recovery commands. Dirty,
missing, ahead, diverged or misbound checkouts and
failed checks refuse; later core commits are skipped and retries report
current without another push. Regular untracked `.DS_Store` files at any depth
do not make the recorded checkout dirty; preview and refresh preserve them.
Tracked changes and unrelated untracked files retain their ordinary checks.
Symlinks and directories named `.DS_Store` refuse even when ignored or empty.
Unreadable ignored directories are retained; other unreadable directories
name a relative path and the read-access remedy. Refresh and target-close
receipts record metadata-scan durations and skipped ignored directories.
An ignored ownership record retains disposable
worktree and branch cleanup across failures; retries finish that cleanup before
reporting current or skipped. Cleanup uses the recorded temporary parent and
filesystem identity, so changing TMPDIR alone does not strand it. If the clone map has changed, inspect the ignored
`<control-root>/local/starter-refresh/<sibling-id>.json`, restore its `checkout`
with `worktree clone <sibling-id> <absolute-path>`, retry close to finish cleanup,
then record the replacement checkout. Cleanup never adopts that replacement's
objects. If the physical checkout moved or disappeared, changing the mapping
alone cannot recover it: restore the checkout at its recorded path or perform
explicit manual ownership recovery. The checkout fast-forwards after success.
The five-field sibling receipt waits in main’s ignored pending lane; the next
`worktree start` carries it into the new order’s reviewed change and regenerates
its registry before consuming the pending file. Duplicate receipts for one
manifest collapse to one registry entry. A resumed start skips a missing
captured receipt only after finding the same hash in another worktree;
otherwise it refuses and names restoring the evidence. `release-close.json` and the
summary record each refresh without the local path. A refusal is a close
blocker with the same retry command and leaves publication unchanged. Target
orders, older-version closes and non-publishing closes refresh nothing;
dry runs judge the head main would fast-forward to and preview the checks
without changing checkout files or publishing, including the proposed sibling
tag and Release. Pending refresh or validated
cleanup work reports `preview`; an already current starter reports `current`,
and a cleanup ownership mismatch refuses with the same recovery guidance.

By default a registered target closes with `no-release`: fetch the declared base,
fast-forward the clone's base, prove the target branch merged into it, remove
its local bundle, worktree and branch, then close the launchpad worktree.
A dirty base checkout, failed fetch or non-fast-forward base refuses before
changing clone refs; dry-run fetches for the containment preview without
moving the local base. The base counts as checked out only where a worktree
entry holds this clone's checkout of the base branch; any other entry for
the base, gone, reused or locked, is not one, and the close never moves the
branch underneath it: it completes when the base needs no move and otherwise
refuses naming the entry and the remedy; a checkout it cannot inspect
refuses. A close refusal that names a path names it relative to its tree, by
the tree's role, never as an absolute path; the rerun command it prints is
the one exception, carrying the launchpad's real path so it runs as pasted. An
ignored-material refusal lists each foreign path once, retaining nested path
names in the base checkout, and
prints the exact close command to rerun after moving or removing the listed
paths. Regular untracked `.DS_Store` files at any depth are disposable Finder
metadata, whether Git ignores them or not: they do not make the target or its
clone's base checkout dirty at close. Dry runs keep them; a publishing close
may remove them before its Git operations. Tracked changes and non-regular
entries keep the ordinary protections; ignored symlinks and empty directories
named `.DS_Store` also refuse. Base updates hold the clone writer reservation
lock and disable repository hooks and filesystem monitors. Both worktrees and the bundle remain
until cleanup is safe. If the bundle manifest is missing while its installation
receipt or shared-exclude registry member remains, close retains the source
even if the target directory is absent, and names restoring the installed
manifest and bundle files before the exact
retry command. It cannot report a clean close with that ownership residue.
A class or registration declares `disposable` paths (relative and contained;
the class's entries and the registration's compose into one sorted set and
nothing removes a class entry). At close, every
ignored path under a declared path is deleted from the target worktree before
the ignored-material judgment, and the base checkout's untracked files are
judged by the fetched base's `.gitignore` blobs, never the pre-merge working
copy's rules, global excludes or init templates. The ignore judgment supports
a streaming tracked-tree scan that retains only ignore blobs; a candidate
path list exceeding 16 MiB refuses with a named reduce-tree remedy and never
echoes the captured path list. Unreadable ignored base directories, unwritable declared output and symlink
components under disposable paths refuse before deletion, naming the tree,
path and access or preservation remedy. A filesystem removal failure after
deletion starts stops further deletion and names the checkout role, disposable
directory, failed entry, error class, access or immutable-flag remedy, and exact
close command to retry. The scan includes already-ignored files and files the fetched
tree stops ignoring: one the fetched tree ignores under a declared path is deleted,
one it ignores outside every declaration refuses naming the path and the
registration remedy, and one it does not ignore keeps the ordinary refusal.
The registration's optional `baseDisposablePolicy: "judge-only"` retains the
base checkout's output while keeping every material judgment and refusing
collisions with fetched tracked paths; the default `"delete"` also deletes
its declared output. Both policies delete the target worktree's declared output.
Preview, receipt and role text name the policy. Regenerable output selected
for deletion is deleted, never moved to scratch or offered back;
preservation is for operator material, evidence and intake. The receipt lists
the deleted roots with their file counts and repeats the gate's
`baseCheckoutWrites` advisory, the untracked files a gate command left in the
clone's base checkout; an unreadable advisory record is reported as unavailable
and does not replace or block the checkout judgments. Under the registration's literal host-rule fallback the
close removes the order's rules. The launchpad gets no tag. The target gets
one only under `release: { "policy": "declared" }` with the order's
`**Target release classification:** patch | minor | major` header and
`release.close` in the registered authority profile: after containment is
proven, the next `v*` tag above the tags the merged base reaches (none means
`v0.1.0`; a tag an earlier attempt of the same close published is reused
with that attempt's recorded commit, even if the base later advances) is
created as an annotated tag on the merged base through the
isolated lane and the target's GitHub Release is created from the body the
order names (WO-227): `**Target release notes:** reviewed` renders the order's
five-section `RELEASE-NOTES.md` at the merged revision, the order title once
under the overview, links to the records the kit moved into the target
written absolute to the target at the tagged commit, other relative links
as their text and the close line last, and refuses before any tag push when
the file is absent or invalid; `objective`, or no header, keeps the title,
objective and close line byte for byte. The tag message and the body pass
the outward lint as a target's text: launchpad identifiers refuse outside
the kit's frame (the order title, the close line and the address, tagged
commit and record path the renderer itself writes for a moved record, whose
words are not reviewed either; a target URL, query or fragment the notes'
author writes is judged like the rest of the notes, whatever its commit or
bytes, though a fragment may name the closing order's own identifiers; a
match is exempt only when it lies wholly inside the frame, so a listed term
running from a written record path into the author's fragment is reviewed),
review words and review-mode private terms wait for `--confirm-terms
sha256:<digest of the body>` on the close, and the registered display name
reads as a name for the public review words (the private list is never
masked). The body's source, digest and confirmation are bound in the close
record: an attempt that pushed the tag and still owes the Release republishes
the bytes it bound or refuses on changed notes, and a completed Release,
legacy body or reviewed, stays current on a recheck by its recorded bytes.
Repeated rechecks retain the source, digest and confirmation of the actual
published body; later notes never replace that binding. A legacy Release
without a body binding acquires one from its admitted existing body.
The registration's optional `release.displayName` uses the launchpad name
shape and 64-character limit, defaults to the registration id, and makes the
Release title and tag message's first line `<displayName> <tag>`; the order title
and close line follow. Existing Releases keep their titles. `--dry-run` previews
the tag and title. Only a recorded real attempt owns an idempotent tag retry;
a different order's same-commit tag remains a baseline, and a tag at another
commit refuses by name. Declared target policy is recorded before cleanup
preflight; a refusal before any tag exists is a publication failure. All
publication prerequisites precede target deletion. A retry never adopts a moved
tag; if the remote tag disappeared, it can only
recreate the tag at the recorded commit
(WO-221).

A target order's records branch is versionless and requires one well-formed
README release claim at least as new as the latest release. It needs no
release notes; `release prepare --local` reports no release without assigning
a version or changing files. An instance self order keeps the version, notes, component and
workspace-pin checks; its manifest uses the carried tag template and compiled
schema declarations. Kit license surfaces check `docs/LEGAL.md` pins only when
the instance declares the file; missing pins in a declared file still fail.

Publication refuses tracked dirt; cleanup is best effort. Finish/settle preserve
intake and non-disposable control in main's ignored
`docs/control/local/retained/WO-NNN/`, retain collisions, verify bytes and
refuse unsafe symlinks or uncertain writer/gate ownership. Lane rows are
recomputed. After preservation verifies, each scratch repository is removed and
its row records the path, the head commit and whether a remote held it; a
repository the close could not remove is a blocker that retains the source.
`--material [<absolute-worktree>::]<path>=preserve` keeps a scratch repository
and `=disposable` states the default; a word that names the intake lane, a
declared submodule or no nested repository refuses. Attempts record
`release-close.json` there; failures writing the current attempt only advise.

After preservation verifies, removal restores write permission on directories
inside the subject that the current user owns, without following symbolic
links. A retained receipt binds the original subject path, its contents and
preserved destinations. A directory Git has already unregistered remains a
blocker until it is gone; the same helper removes it only after that receipt
verifies and writer/gate ownership is clear. Once the worktree and directory
are gone, the run deletes the merged branch. Dry runs show that deletion.

Leftover verification temporarily opens the anchored restricted beacon
directories and restores their original permissions when they survive. A
retry follows each path's latest cleanup outcome and resolves only blockers
bound to the path it removed; every retained row carries a reason and retry.
If close history is missing or unreadable, the order's retained removal receipts
can recover candidate paths, whose preservation proofs still decide removal.
When those receipts cannot distinguish the primary subject from a derivative,
the branch stays until every recovered candidate is gone. Paths already
recorded removed are excluded even if their old receipts survive.

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
The generated body and disposition replies cite target-native commits, files,
criteria and declared references, omitting unmappable evidence with a count.
The outward lint rejects runtime evidence identifiers in branches, commit
messages, titles, bodies and replies; event payload references remain intact.

For a session order, `worktree publish WO-NNN --target-worktree --branch
<type>/<slug> --title <title> --body-file <path>` reads a committed contained
regular body file from the clean order launchpad. Both session forms use
the same publication base: the subject's merge
base with the fetched target base branch when it descends from the activation
base, otherwise the activation base; the Change table, existing-path exemptions
and no-change check use that described base, and the closing sentence also
names the activation base when different, without rebinding any record.
Its opt-in `--draft` form
is legal at `verified` with a passing verification: it reads the body's
working bytes, writes a commit object from the target worktree's working tree
through a temporary index (HEAD and the index unchanged), pushes it to the
declared branch from the isolated lane, opens a draft pull request and records
`DraftPrepared` before remote effects, then `PullRequestOpened` with `draft`,
`branch` and `headSha`. Retries reuse a prepared commit while its tree, parent
and title match. A failed PR edit may retry with a corrected title against any
recorded preparation or pull-request head for the same order, repository and
branch. An unexpected remote head refuses with commands to preserve that head
before a leased restore, or recreate an absent recorded branch; an attempt that
never created its branch may create it under an empty lease. Ignored and intake body paths, including symlinks into
those paths, refuse. A draft at `active`
or `ready-to-verify` refuses naming the phase, a second draft at the same tree
reports already published, and one at a new tree updates the same pull
request. The closed-phase publish of the same order reuses that branch and
pull request: it pushes the reviewed commit with `--force-with-lease` against
the recorded draft head, updates the title and body, marks the pull request
ready and records the reuse; another `--branch` refuses. One pull request per
order; core names no draft step and no actor, the instance's order does
(WO-221). Trust for these commands comes from the registration and the kit:
the emitted hook admits only the node spelling of the controlled publish helper
in main at the phases the lifecycle makes it legal, under main's committed
registration, authority profile, operator grant and clone map, with host deny
rules still applying. The helper's tracked source files in main are compared
with one pinned main commit. A helper in the order worktree receives an advisory
with the command for main's copy. The comparison with both checkouts projects
the configured roots and the selected registration's `baseBranch`,
`authorityProfile` and `release`; gate commands and other operational fields
may differ. A differing publication field is named, while the grants file
still requires byte equality with main's committed file. A recognizable
node publish or release-close helper hidden by a pipe, redirect or prefix
gets a `registeredTargetAdmission` row with `kind: "near-miss"` and its
`syntax`, plus an advisory to run the plain spelling; it gets no permission
decision. Raw Git, gh and npm receive no automatic
registered-target admission; `worktree start` prints the Codex `--add-dir` and Copilot
`--allow-tool` lines; and a registration's `hostRules: "literal"` writes that
order's exact rules to the main checkout's untracked local settings and
`.codex/rules/dotln-WO-NNN.rules` until the close removes them, `harness check`
naming a stale one. The hook journals each admission it carries as a
`registeredTargetAdmission` row (the order, the registration and the
command's kind) and each withholding as an `advisory` row in the session's
host observation log, `docs/control/local/harness/<session digest>.jsonl`
under the launchpad root (the digest is the SHA-256 of the session id),
which a session reads as a file; a host denial after the hook's allow is
journaled as a `HostPermissionDenied` row, and a prompt the operator
answers leaves no row (the 2026-10-19 fork-requests pass §6). A session that
ran the npm spelling reads, at v0.85.0, the ordinary PreToolUse row with
`effect: "lifecycle.run"` and `allowed: true` and no
`registeredTargetAdmission` row, which is what the operator's instance
observed for its WO-005 draft on 2026-10-20; since v0.87.0 it reads an
`advisory` row naming the node spelling (the 2026-10-20 fork-answers pass §4). Claude ownership is held in an ignored per-order sidecar
under the configured control root's `local/host-rules/`, preserving rules the
operator already held; JSON settings contain no comment markers and Codex's
TOML configuration contains no prefix-rule table. A `host-rules --rewrite`
requires the committed literal opt-in and matching target registration before
changing any rules; `--remove` remains available after opt-out for recovery.
Settings and sidecars are checked before start or close mutations. The Codex
file hash and path are owned by that sidecar and its exact ignore line is
removed at teardown. Rewrite removes retired owned prefixes; removal journals
the before/after allow lists by hash before replacing settings atomically, so
a retry removes one owned occurrence and preserves duplicates. Intervening
allow-list edits refuse for inspection, and an incomplete removal must finish
before a rewrite. A removed and identically re-added
sole operator rule is unobservable and remains an ownership limitation.
Its latest passing final
review must bind `targetSubject` and `targetGate`, and `TargetRecordsCommitted`
must bind the target's current clean HEAD as a records-only child of the
reviewed commit. It validates installed bundle ownership before reading its
file list; a missing or drifted manifest cannot erase that ownership. It
rechecks each recorded blob, path and mode, refuses bundle files and a reviewed base with no change, screens every pushed commit and the
final body, and requires both effects in the registered profile and an
operator grant for that repository. Session publication reads both from
main's committed configuration and registry, requiring the working files to
match those blobs; the publishing branch cannot authorize itself. It uses the same isolated push lane and
forge identity check as the episode route. The body appends the change and
target check results, never command text or runtime identifiers. The main
checkout's ignored control-local `target-publications/WO-NNN` log records
`PullRequestOpened`; a rerun reports the same commit's publication without
pushing. No launchpad branch moves. Publish the launchpad's records branch
separately with the self form: it carries the control segment and record
links, refuses re-added moved reports, and proves equal code identities at
HEAD and its merge base with `origin/main` in place of a reviewer product gate.
A changed code identity still requires that reviewed gate.

Each registered repository declares `gate.commands` (named argv and positive
`timeoutMs`), `plain` and covering `review` selections, and an optional
`documentationRoot` (default `docs`, with the launchpad's default segments).
`node scripts/target-gate.mjs WO-NNN [--review]` runs in the target worktree
and binds each command and selection row to its non-ignored bytes and HEAD;
a command's mutation judgment compares its own before and after state. A later
innocent command can pass, but any failure, timeout or mutation still fails the
selection, even if another command restores the initial bytes. A missing
repository registration produces a named briefing diagnostic. Target-order product-gate
claims resolve only to these rows, with the latest covering row for the current
command definitions deciding;
the launchpad document gate still judges its documents. Passing final review
records `targetGate` at the clean reviewed commit. `npm run resume --
target-records` copies the order and moves decisions and every filed report
into that root as one records-only commit, recording paths and hashes in
`TargetRecordsCommitted`. Metadata, follow-up indexes and status resolve moved
records through the recorded repository, commit, root, path and hash, reading
regular blobs without replacement refs; current registration paths and working
copies cannot replace that evidence. Run `npm run meta` and `npm run plan --
followups --sync` after moving records. An ignored pending receipt lets the same command
resume an interrupted commit or source removal after verifying the exact bytes.
Records-only and planning commits use the host's signing policy, as starter
refresh does; hooks and filesystem monitors stay disabled. A signing failure
retains the pending work for retry.
Changed inputs refuse with the work retained. Raw evidence and the body stay in the instance.
`npm run plan -- target-publish <repository-id> --base <commit> --from
<directory> --branch docs/<slug> --title <title> --body-file <path>` publishes
only product and planning documents under the same root, refusing hidden files,
Finder metadata, editor backups and unsupported file extensions from the planner's
read commit. The title becomes the commit subject and must use the conventional
`docs:` or `docs(scope):` type; other types refuse before remote access.
Its operator-grant registry must match committed authority bytes; unrelated
planning drafts may remain. The target cleanliness check disables configured
filesystem monitors as the other host Git reads do.
It prints links for the instance's planning document and leaves
refutation scoped to the instance subject. A failed publication preserves its
temporary worktree and pending receipt; rerunning the same command validates
and resumes that commit, then completes cleanup after publication.

## Documentation freshness and ownership

The executor owns current factual documentation for its change. Before declaring
implementation ready, update affected blueprint facts and their reader entry
points in the same pass: examples, names and paths, component/source claims,
capability limitations, runbook instructions, planning recommendations, and
publication links where the change reaches them. Use the diff and inbound
references to bound the check. Write back by editing the sentence that is now
wrong and citing the evidence; a dated paragraph appended under a product
heading is a receipt and belongs in the order's evidence README, and a
candidate belongs in the planning map (operator direction, 2026-09-25; WO-085
binds `scripts/docs-check.mjs` in `npm run test:docs` to the byte ceilings
in `docs/control/doc-ceilings.json`). Record the affected surfaces
and evidence in the existing work-order outcome or breakout receipt; do not
create a new ceremony or rewrite unrelated historical artifacts. The front
page, `README.md`, is edited only by an order whose leading header carries
`**Front page:** README.md` on main, within the “What runs today” line budget
that `docs/control/front-page.json` records on main: the section is named once
among the headings, the page holds no raw HTML outside its marker lines and no
receipt outside its generated blocks, and each counted line is one whole,
unwrapped sentence of Markdown prose; a new bypass or wrongly refused sentence
becomes a row of `scripts/fixtures/front-page-corpus.json` before the check
changes, and the front-page order applies the operator's recorded judgment,
asking only about a choice no record covers.
The release block between its markers holds only the version line
`release prepare` writes. Any other order proposes a capability the page should
mention as one sentence in its evidence README, and when a planning pass finds
two such proposals waiting, it files a front-page order
([WO-189-D001](../evidence/WO-189/decisions.md#wo-189-d001),
[closed judgment](../evidence/WO-189/decisions.md#wo-189-d021--repair-close-the-surfaces-where-github-and-the-parser-disagree-and-judge-each-line-twice)).

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

## Verification review and attack

Verification is the implementation review and attack before final acceptance
[[WO-187](../work-orders/WO-187-verification-attacks-and-reviews.md)]. Run these
three duties in order; choose relevant lenses and state why in the report.

1. **Attack the change.** Judge every original criterion and reproduce its
   consequential claims. Vary what executor fixtures held constant: empty,
   forged or stale inputs and records; working directory; a member outside
   the declared list or vocabulary; a second or repeated token; the real
   corpus instead of a fixture; and paths introduced by a repair. Name tried
   variations and explain those that do not apply. Consuming the executor's
   passing handoff rows (the structural row, the Preflight rows and the
   document row, or a complete row) limits product-gate reruns, never
   independent probes or `--only` reproductions. Check earlier findings as well.
2. **Review the implementation.** Read the whole subject diff, asking whether
   it is correct beyond the named criteria, whether a simpler alternative
   holds the same contract, what a maintainer will not understand in six
   months, and whether it fits repository principles and the platform lens
   in §Goal-aligned decisions. Propose improvements with concrete evidence.
3. **Read the two worker reports and reproduce.** The executor's adversary
   and improver (below) ran at `implementation-ready`; read their reports
   and the executor's dispositions, and reproduce the claims your verdict
   rests on. Spawn a fresh `dotln-worker` only to reproduce one named
   claim you cannot run yourself, with only the order and diff. Never
   delegate the verdict [2026-10-07 pass; the operator's direction of
   2026-10-02 as WO-187 D051 records it].

The operator delegates decisions to each phase, including at blockers: make
and explain the choice in the ADR or decision record, with evidence, tradeoffs
and a reopening condition. No-op and deferred are valid outcomes when their
evidence, consequences and reopening conditions are recorded. Do not ask the
operator to arbitrate implementation
or change criteria. Continue under the existing requirements and authority;
a permitted operator-only packet records the safe default and consequence
without demanding a response. This is a standing direction for every phase
[[WO-219-D003](../evidence/WO-219/decisions.md#wo-219-d003--own-decisions-in-every-phase),
2026-10-23].

A finding fixed during a passing final review remains listed once with its
original class and the `follow-up` route; the report prose records its fix and
passing evidence. This retains the complete finding count without adding a
fourth route or presenting an already fixed defect as an unmet criterion.

Every finding takes a route: `blocking` when an acceptance criterion is
unmet, or when the change breaks behavior `main` had and a probe or fixture
shows it (fail the verdict); `follow-up` for every other defect, reproduced
and boarded, a defect in the declared surfaces that breaks no criterion
among them; or `operator` for a decision packet that names the choice only
the operator can make, evidence, alternatives and consequence. The verdict
is bound to the criteria: WO-112's VER-002 to VER-006 each met every
criterion and failed on new in-surface defects, and the order closed by
override after seven verifications [2026-10-07 pass]. Maintainability alone
is a follow-up. The verifier routes a blocking finding with its repair rule
on its own authority; `operator` is for a choice outside the order's
criteria and declared surfaces, never a request to authorize a repair
inside them [WO-187 D042, 2026-10-06; 2026-10-11 pass]. §Discipline's Adjacent Repair boundary still applies: the
next repair, if one happens, fixes boarded follow-ups in the declared
surfaces within the Boy Scout bound. The verifier writes evidence and its
immutable report, never the implementation it judges.

For a design defect in the declared surfaces, the verifier names the repair
rule itself; it is blocking only when a criterion is unmet or a regression
is reproduced. Reviewers and verifiers judge confinement and security
boundaries from the recorded rule and propose defensive repairs, without
working out circumvention paths. After one provider safeguard refusal, change
approach; the standing stop after two consecutive refusals remains. Before
emitting an audit or repository read, select verdict-relevant fields, budget
the aggregate batch and check for nested gate logs or truncation. Keep full
results in scratch. An acknowledgement of a process failure names its durable
record and disposition in the same response.

On re-verification, re-derive every criterion whose surfaces the repair diff
touches and reproduce the repaired findings. Carry untouched claims with
their original evidence; an earlier passing fixture is not evidence for a
changed path. A new defect in the repair that breaks no criterion is a
follow-up, so a repair loop ends when the criteria hold.

The verify briefing prints every `Known issues and carry-ins` section of the
order as written, under a header naming its label's line, the last line
printed and the line that ended it, then the latest filed planning judgment
naming that order's known issues. The reader is
`scripts/lib/verification-briefing.mjs`: a section starts at the field's
label or a heading of that name and ends at the next heading or at an
order-field label after a blank line; fenced lines are text; the briefing
advises on an empty section or an unclosed fence. The latest planning receipt
remains authoritative when its findings field is malformed: advise that its
findings are unavailable, never resurrect an older receipt. A missing receipt
id uses the filename; a valid empty findings list prints `known issues: none`.
The work-order text and latest receipt are the briefing sources; map citations
are read separately when the order names them.

| Lens | Question | Suitable changes |
| --- | --- | --- |
| Correctness and tests | What input or transition disproves the claim, and does its test fail? | All orders; especially state, parsers and repair |
| Design and coupling | Is there a simpler implementation with the same contract and fewer coupled parts? | APIs, machinery and architecture |
| Platform fit | Is the capability a consumable, externalizable interface used here and understandable outside this session? | New capabilities and artifacts |
| Operator flow | Can a person finish the task and recover without another routing ritual? | CLI, lifecycle, UI and handoffs |
| Authority and private data | Do effects stay authorized and public data stay separate from private inputs? | Hosts, writes, transport and publication |
| Maintainer in six months | Can the next maintainer explain the rule and change it safely? | Every nontrivial implementation |

Before `implementation-ready`, and not before `repair-complete`, the
executor spawns two fresh `dotln-worker` agents, each given only the order
and the diff, with distinct briefs. The criteria adversary seeks concrete
counterexamples, failed acceptance criteria and missing regression tests;
design cleanup is outside its brief. The design improver seeks simpler
structure, lower coupling, sound error handling and what a maintainer will
not understand in six months; criterion verdicts and adversarial test design
are outside its brief. An issue discovered in the other lane is transferred,
not reviewed twice. The executor fixes or records every distinct finding and writes a line in
`handoff.md` that starts `self-review: found N; fixed N; recorded N`, then
names both workers or the separate-pass fallback and its evidence. A list
marker, balanced inline emphasis or code wrappers may decorate the line;
case and a parenthetical worker label are tolerated. The three integer counts
remain required; quoted or fenced examples are not the line. Absence advises once
and never refuses completion. A line does not prove a review occurred. Until
WO-196 regenerates the role text, this section governs where a role sentence
differs from it.

Final review is acceptance: the criteria, the integration and the release
surfaces. A finding outside the criteria that breaks no behavior `main` had
is a follow-up by rule, never blocking; the class counts below still measure
escapes [2026-10-07 pass].  Its report lists every finding once, in
one block: a `<!-- dotln-findings:start -->` line, a JSON array and a
`<!-- dotln-findings:end -->` line. Each entry is
`{"id": "F1", "route": "blocking", "class": "escape", "summary": "<one line>"}`:
an id `F1`, `F2` and so on that no other entry has, a route (`blocking`,
`follow-up` or `operator`), a class and a one-line summary. A review with no finding writes
`[]`. The class is `escape` when the defect was present in the verified
subject and inside verification's instructed review scope; `integration` when
it arose from integrating main or preparing the release; or `new-scope`
otherwise. Record the basis for that judgment in the report's prose.
`final-review-result` reads only that block and never counts a prose line. It
records the three class counts and `unclassed`; an entry whose class is
missing or outside the three counts as `unclassed` and is named in one
advisory. Counts that cannot be complete record as unmeasured, with one
advisory naming the cause: a report without exactly one block (any other line
whose only letters are a marker's name is a second copy, an example
included), a block that is not a JSON array, an entry with a bad or repeated
id, an unlisted route or no one-line summary, or a failed review whose block
lists no blocking finding. The result records in every case. `plan failures` shows per-order counts (its export includes every
order); `plan start` gives escapes per final review across all attempts of
the ten most recently reviewed orders. Historical events without counts are
unmeasured, so the rate is unknown until every review in that window is
measured.

Byte headroom is an operating-cost goal: measure before and after, preserve
useful duties, and board any overrun for optimization with equivalent
usefulness [[operator direction, 2026-10-05](../evidence/WO-187/decisions.md#wo-187-d003--preserve-useful-guidance-and-report-byte-overruns)].

## Discipline

- **The handoff sequence (2026-10-07 pass, revised 2026-10-19).** Finish
  source edits, run `npm run format`, use `npm run sync` for stale
  publication, bookkeeping and installed-harness artifacts (a gate compiles a
  stale runtime itself). The executor and every repair start one complete
  run, `npm test -- --review`, in the background and never under the bounded
  probe wrapper; it leads with failed and newly changed suites, while older
  branch changes may follow exclusive work. After it passes
  they write the report with its evidence, run `npm run test:docs` once
  after the last document edit, and record. Verification consumes the
  executor's complete row at the current identity and uses focused probes.
  Final review integrates main, reproduces each blocking claim first and
  fails without a complete run when one reproduces; otherwise it reuses the
  passing complete review row at the integrated code identity when one
  exists, and only when none exists runs `npm test -- --review` once in the
  background after the last source edit and formatting, awaiting it with
  `node scripts/harness.mjs evidence --wait` while reading the subject. No
  role writes gate inputs or starts agents during a run, and a review gate
  admits no record writes. Completion consumes the rows and runs no gate. A
  source edit changes code identity, so the complete row must run at the new
  identity, as must the final review; report, control and
  generated-document edits keep code identity, and the document row stands
  only while the working tree is the one it judged.
- **Scratch repositories (WO-188).** A nested repository outside the intake
  lane that the tracked tree does not declare as a submodule is scratch. An
  executor removes each before `implementation-ready` or `repair-complete`
  and never declares one; a completion with one present prints one advisory
  naming it. Release close removes any left after preservation verifies and
  records its path, its head commit and whether a remote held it; intake and
  declared submodules stay, an operator word through `--material` preserves a
  scratch repository, and teardown is never forced.
- **Comments (WO-188).** A comment says what the code does or why, in words a
  reader who has not seen the order understands; an order, report, finding or
  decision identifier never leads or replaces that explanation, and a
  report-local label (a verification or final-review finding label, a bare
  decision number) never appears in code. The document gate refuses a new or
  changed comment line that breaks the rule; the lines that carried one when
  the check was installed, all in edition-registered sources, pass by a
  fingerprint baseline in `docs/control/comment-baseline.json` that only
  shrinks: a baselined line that is edited without being fixed fails, and a
  file outside every evidence edition is never baselined.
- **Experiments (WO-196, WO-188).** An experiment happens when the work shows
  two credible ways to the same result that differ on a named axis, at any
  point in the order: the executor runs one bounded comparison and records
  both arms; when no such fork appears, nothing is written; an order may name
  an experiment for the executor to run. A lens is written down only when it
  changes what the role will do: before a material choice, name the traps that
  would change the action, what will be done about each, and the NoOp; where
  none applies, write nothing; at handoff, say whether the outcome matched.
- **Host resources (WO-185).** Dispatch registers the verified agent ancestor
  with one detached guard per user, shared across clones and exported instances
  through the operating system's per-user temporary root. The runner, guard and
  `node scripts/harness.mjs bounded -- <command>` use physical footprint budgets
  from `docs/control/budgets.json`: a gate gets one half of physical RAM,
  each task gets that gate share divided by the recorded host lane capacity,
  and all attributed DotLn trees get two thirds. Breaches kill the
  offending process groups before writing typed `memory-budget` incidents.
  Ledger and membership-publication failures are reported without preventing
  the stop or its task/gate result. Bare stops name the largest member and retain
  the group identity and cleanup attempts. `plan failures` counts a stopped
  PID/birth identity once across guard and runner incidents, separately from
  failed gate rows; historical incidents without that identity count as rows.
  macOS reads its footprint ledger, including nonresident memory; unavailable
  signals are named and readable signals remain active. The runner records
  sampled task and gate peaks, bounds output, retains failure diagnostics and
  stops its task groups on interrupt, termination and hang-up without recording
  a gate row. Every gate shares the host registry's weighted lanes: the first
  acquirer records the lesser of eight and half the logical processors, at
  least one, and later acquirers inherit that capacity. Nested gates
  suballocate the parent reservation validated at gate entry. Waits label
  each holder as this checkout, another checkout or checkout unknown, without
  exposing a checkout path. The gate row and summary report the union of lane
  waiting intervals separately from work; relation-specific unions can overlap.
  `node scripts/harness.mjs lanes` reads capacity and live holders without
  taking the lock or reclaiming records. The structural host check refuses
  a per-lane budget below the
  largest measured task RSS of the baseline passing runs. A wait-notification failure rejects acquisition after cancelling and
  draining its lock helper; it leaves no reservation or heartbeat behind.
  Swap growth triggers a footprint census relative to the last such
  census, so past growth alone does not force a lifetime of fast sampling.
  Signal ticks are one second and steady footprint censuses four seconds;
  startup, pressure and swap growth take earlier censuses. At the recorded
  3.4 GiB/s growth rate those intervals allow nominal growth of 3.4 and
  13.6 GiB respectively, plus census and cleanup latency (WO-185 D026).
  Run probes under the bounded wrapper, one process at a time. A probe's
  copy of a repository leaves out `.control-beacons` and guards per-file
  size: a Beacon group file is sparse and a recursive copy writes its
  logical size in full (two probe copies filled the host volume on
  2026-10-06; WO-187 D053) [2026-10-11 pass]. The wrapper
  preserves argv, the caller's environment, working directory and ordinary exit
  status, with the existing 900-second deadline and bounded output tail; a
  memory-budget stop exits 125. On the measured
  macOS host, original-parent identities and inherited output-socket identities
  retain ownership through detached descendants, including unsampled double
  forks. The kernel recycles a freed socket's identity and descriptor number,
  so a runner or bounded wrapper publishes a descriptor watch only while it
  holds the captured endpoint open, and withdraws the watch from its monitor
  and registration before releasing that endpoint; the guard keeps a census's
  descriptor matches only for registrations still present after it. The
  census reads no process environments, arguments or file paths.
  A process that loses every descriptor mark before any observed ancestry edge,
  or an unwrapped bare tree with such an edge missing, can still escape polling.
  WO-185 records this limit; supervision is not absolute containment. Test
  commands attribute incidents to disposable fixture repositories. A guard
  that loses its `guard.json` record while still holding `guard.flock`
  republishes its own identity on the next census. A registration reuses that
  owner and retires any startup child that was never adopted, including on
  timeout; it does not leave a waiter behind. This recovery preserves the
  live guard's observation history (WO-217).

- **Outward artifacts (WO-063).** The [pure lint and stdin CLI](../evidence/WO-063/implementation.md) check conventional commit subjects, PR titles and branch names plus the configured public vocabulary and redacted local-term check, report absent local coverage as `unavailable`, and leave publication integration to WO-064.
  What the lint was for, in the operator's correction of 2026-10-21 (the
  planning dispatch's sibling capture, SHA-256 in the planning document §1):
  three things, and no fourth. Launchpad identifiers (work-order numbers,
  decision, follow-up, verification and review ids) stay out of comments,
  commits and pull requests that leave the launchpad; the private
  local-terms list (`docs/control/local/terms.txt`, ignored, refused by file
  and line without printing the term, rule `vocabulary.local`) applies to
  commit messages and pull-request text and not only to committed prose,
  which is the gap WO-063's observed gap named; and DotLn-specific terms
  that are not publicly known words in the target's context are a reviewer's
  judgment, because they are still ordinary English words. WO-063 built the
  third as a token ban: `terms` in `docs/control/outward-vocabulary.json`
  refuses every outward artifact of a target publication that contains a
  listed word (rule `vocabulary.launchpad`), which the operator's instance
  met as a refusal of its own fixture name and its target's subject matter.
  That reading was never the intent, and the 2026-10-21 pass records it as
  a misreading, not a rule. The same holds for a private term that is also
  an ordinary word (the operator's second correction of the same day): it
  is refused as the private system's name, never as the word. The public
  list is a review list (`reviewTerms`; the older `terms` key is read as
  the same list for one kit release): a target publish names the words it
  found with their lines and the part of the composed body they sit in,
  reviewed prose, Change table or target checks, and refuses until the
  reviewer confirms them with `--confirm-terms sha256:<digest of the
  composed body>`, never on the word alone. Each private term has a mode,
  `refuse:` or review by default; a review-mode match is confirmed the same
  way and a refuse-mode match refuses as before, while in committed text
  every listed term still refuses. Launchpad identifiers (`WO-NNN`,
  `WO-NNN-DNNN`, `FUP-<16 hex>`, `VER-NNN`, `FINAL-NNN`, `REVIEW-NNN`,
  `WS-NNN`) refuse in a target's branch, commits, title and body under
  `identifier.launchpad`; the kit's own frame, the records it moves into the
  target and a Release's order title and close line, is exempt from that
  rule alone. Either list may be empty. A Change-table row of a path the
  target's base already held is the target's vocabulary and is not reported.
  An exemption covers only a match lying wholly inside its frame part or
  row; a match that runs out of it into authored or added text is reported.
  Private findings retain the complete contributing line range without the
  term or its columns. Every row in that range keeps its path and other
  matched text redacted in diagnostics; the rule, starting line, section and
  private mode still locate the review item.
  The confirmation (digest, match count, actor attestation) is recorded in
  the publication log and the session journal, so nothing leaves without a
  reader having seen the flagged lines (WO-227). The
  publication helpers read the vocabulary and the grant from `main`'s
  committed bytes, so a change reaches `main` through a documents pull
  request before the publish that needs it, never by editing `main`'s
  working tree, which the next `worktree finish` refuses.

- **Compose adjacent repair with decision evidence.** The executor/fixer
  equips [Adjacent Repair and Decision
  Receipts](05-pattern-library.md#executor-supports-adjacent-repair-and-decision-receipts)
  independently [operator default, 2026-09-08]. Adjacent Repair prefers a bounded fix to an encountered bug;
  neither pre-existing origin nor omission from the original assignment is by
  itself a reason to defer. A repairable defect in the order's declared surfaces stays in the order and may fail a criterion it breaks; outside both criteria and surfaces, board its reproduction. Decision Receipts records the chosen option,
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
  Settle routine version, waiver-route, live-episode, regeneration and reinstall questions within existing authority. Every phase owns its decision, including no-op or deferred: record the evidence, tradeoffs and reopening condition instead of asking the operator to arbitrate implementation or change criteria [WO-219-D003, 2026-10-23].
  Ordinary `next`/`fix` projects installed equipment and queue state without
  requiring a named-support prompt. Completion advises about queued/running items;
  complete them or record an explicit disposition, with a public FUP for deferrals.
- **Release assignment is opt-out.** Prepare the classified next release and
  update its source claim unless the operator specifies no release
  [operator default, 2026-09-04]. `npm run release -- prepare` completes a missing
  activation target in the heading and README claim and records the base and
  classification in the order's decisions; do not repeatedly ask for routine
  release assignment. Retiming an existing target
  and publishing still follow their separate authority rules.
- **Automate recurring procedure.** Prefer an existing executable helper for
  a mechanical step [operator direction, 2026-09-04]. When authorized work
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
  when the transcript has not yet flushed them. Bounded terminal notice
  envelopes also journal as host messages and are excluded from operator
  intervention counts. Exact transcript authorship takes precedence; unmatched
  prompts and queue-operation enqueues without a command mode remain
  unattributed. It uses the prompt boundary's time until an earlier transcript
  timestamp is observed, which can shorten
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
  shifting-the-burden row counts these events (from the order's `meta.json`
  once its journals are gone) and prefixed or off-ramp operator directions,
  without automatic consequence.
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
- **Decided means sourced, not frozen.** A decision record names the
  operator dispatch that made it and the condition that reopens it
  [operator correction, 2026-09-09]. Do not relitigate a decision for lack of new
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
  The ledger holds the operator's own ideas; a planning pass's synthesis
  lives in its planning document (operator direction, 2026-10-13). An inherited
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
- **Projection boundary.** Launchpad identifiers and private terms stay out
  of artifacts consumed outside the system (PRs to other repos, generated
  reports for third parties); whether a DotLn term reads as jargon in a
  target's context is the reviewer's judgment, never a ban on the English
  word [operator correction, 2026-10-21; the Outward artifacts bullet].
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
- **No ratchet creep.** Ratchet creep is one-way drift in a soft-bounded
  property across consecutive artifacts (the length of a title, report, PR
  body, or release notes; the number of sections, checks, disclosures, or
  options; the amount of ceremony) caused by sizing each new instance against
  its immediate predecessor plus a margin instead of against its own content
  and the governing standard [operator correction, 2026-09-07]. No single step looks
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
  The same holds for shape [operator correction, 2026-10-21]: an artifact in
  a series takes its structure from a written standard, a template the
  tooling seeds or a check that judges the structure, and the previous
  instance is additional context, never the source; where no standard states
  a shape, the shape is ad hoc and no later instance is faulted for differing
  from the last; a drifted predecessor is corrected at its source, the
  template or the check, not imitated. The pull-request body is the recorded
  case: `release prepare` seeds `PR.md` with the meter block, the balanced
  example shows prose first and the block last, and the reviewed series
  flipped to prose appended under the block between PR #223 and PR #225 on
  2026-10-19 with no rule changing, then repeated it twice (the 2026-10-21
  pass; WO-227 makes the seed a template and the shape a check).
- **A question is not a waiver.** An operator's question, confusion, or
  complaint about cost or time changes no obligation [operator correction,
  2026-09-07]. Answer it in plain terms, then continue the work under the
  standard already in force; only an explicit operator decision lowers a
  standard, drops a check, or narrows scope. Treating a question as permission
  to stop pursuing a green gate, skip a check, or accept a weaker result is the
  behavior this correction names, and it is the same failure whether the
  question sounds annoyed or curious. If the standard seems wrong, say so in
  one sentence and keep working under it until the operator decides.
  This includes a question labeled "conversation only": answer
  conversationally and continue the active implementation; pausing requires
  an explicit request to pause or stop
  [[WO-126-D019](../evidence/WO-126/decisions.md#wo-126-d019), 2026-09-10].
- **Process budget.** Compare total work and waiting against the failure a
  mechanism prevents [WO-132, 2026-09-15]. `npm run meta` prints each closed
  order's Cost promise beside available observed gate/usage rows and their
  cutoffs. Explicit measurable shortfalls are planning inputs; ambiguous or
  missing observations are unknown. No cost, duration, context or token
  observation refuses a command or completion. Entry/handoff usage is recorded
  when available, never substituted from another session or invented as zero.
  Counters and final timings stay in ignored local observations and the
  response; reports may cite them without causing a product-gate rerun.
  Usage, meta and console actor projections apply canonical `RecordCorrected`
  fields while retaining the original events and correction evidence. A
  per-order meter snapshot records the path and SHA-256 of each retained usage
  copy fully represented in its totals. After later usage arrives for a closed
  or withdrawn order, a linked worktree can explicitly refresh its snapshot
  with `npm run meta -- --write docs/evidence/WO-NNN/meta.json`, reading retained
  copies and current usage from its registered main checkout. The command writes
  only the caller's snapshot and preserves historical metrics and cutoffs. It
  refuses missing previously carried copies; mixed or unreadable copies remain
  retained. Pruning still requires the final copy digest in a committed snapshot,
  so a changed late copy cannot be pruned against an earlier proof.
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
  `CLAUDE.md` plus the role skill, per role) have one route (operator
  direction, 2026-10-05, §Verification review and attack): a reviewed rule
  that breaches a ceiling stays whole, and its measured overrun is boarded
  as a follow-up for optimization with equivalent usefulness. No ceiling is
  raised, no acceptance is recorded, no needed rule is cut to fit, and no
  byte count is put to the operator. `npm run meta` reports the verdict. The
  2026-09-17 route (a 4 KB raise or a dated acceptance) is retired; the
  [WO-044 decision](../evidence/WO-044/decisions.md) (caps yield to needed
  rules) and the [2026-09-17 pass](../planning/vision-into-use-2026-09-17.md)
  §10 record the acceptances made under it.

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
  A command word after an `&>` or `&>>` operand makes the invocation opaque,
  because supported shells can interpret it as another command; a redirect
  followed only by redirects keeps its literal destination. An unquoted zsh
  `=` word is an expansion when it begins a word, including after empty
  quotes, or follows `=` or `:`, with a following character. A lone `=` and
  a quoted or escaped `=` remain literal. Opaque forms are refused beside a
  live gate and delegated to host permissions elsewhere.
  Beside that adapter a live gate admits a fixed read-only list
  [WO-158, 2026-09-25], judged stage by stage across every pipeline and
  command list: `cat`, `head`, `tail`, `wc`, `ls`, `grep`, `sed -n` with a
  script whose every command prints (numeric, `$` or `/regex/` addresses),
  `git --no-pager diff|log|show|status|stash list`, and, at the worktree root only,
  `node scripts/harness.mjs writer --show|evidence --wait [--timeout seconds]`
  and `npm run resume --silent -- status`, `--silent` on either side of `resume`.
  A stage with a heredoc, an environment prefix or wrapper, an expansion or
  an unquoted glob character is not on the list. Four argument forms are
  (WO-168): a quoted word holding `<` or `>`; a revision suffix (`~`, `^`,
  `@{…}`) in a listed Git read's operand; an input redirect from a literal
  path; an output redirect to exactly `/dev/null`. Descriptor duplication
  such as `2>&1` opens no file and passes; `<>` is refused, and any other
  redirect is off the list and judged by that adapter. A listed reader piped into an unlisted or writing stage
  is refused (receipt 028's criterion 6 known issue). A Git read on the list
  carries `--no-pager` (or `-P`): a paged read runs the configured or
  default pager, an unlisted program, whenever its output is a terminal
  (VER-001 F4 ran a configured `core.pager` from an admitted `git log`), and
  `--no-pager` also sets `GIT_PAGER=cat` for the log a stash list delegates.
  It names no output file, no `%G` signature placeholder and no
  external-program option, and is admitted only while the repository configures no
  `core.fsmonitor`, `diff.external`, diff `command` or `textconv` driver,
  clean, smudge or process filter, `log.showSignature`, `gpg.program` or
  `gpg.<format>.program`, no `%G` pretty format and no `post-index-change`
  hook; a configured program returns the
  [WO-142-D012](../evidence/WO-142/decisions.md#wo-142-d012--retain-existing-git-admission-with-an-explicit-effects-follow-up)
  refusal. The index stat refresh a plain `git status` may take remains the
  recorded residual of that follow-up. The refusal text names the list; a
  program joins it only by a later order. The older metadata exception is
  unchanged.
  `for` loops, substitutions and other opaque commands retain their conservative
  gate refusal; use the host's read tools for those reads. This does not change
  writer reservations or the host's permissions. See
  [WO-132-D005](../evidence/WO-132/decisions.md#wo-132-d005),
  [WO-132-D006](../evidence/WO-132/decisions.md#wo-132-d006),
  [WO-132-D007](../evidence/WO-132/decisions.md#wo-132-d007) and
  [WO-132-D008](../evidence/WO-132/decisions.md#wo-132-d008).

- **Machinery stand-down.** The lifecycle exists to carry the rules so the
  operator's attention does not; when it costs more attention than it saves,
  it is the defect [machinery stand-down pass, 2026-09-15]. The operator's
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
  temporary, DotLn session scratch, the host-printed scratchpad, main's ignored
  intake and an operator-named absolute root; the manifest names declaration and authority-grant sources.
  The six default roles carry temporary, session-scratch and host-scratchpad
  grants only.
  `os.tmpdir()` identifies the temporary root; scratch is
  `<system-temp>/dotln/<session-key>/scratch`. Claude role dispatch prints the
  concrete path; Codex uses `node scripts/harness.mjs scratch`. Each, and a
  Codex session begin, creates the directory (mode 0700) first, so a printed
  path exists; a failure is one advisory. Use that scratch
  path: native scratch and `/tmp` need a separate grant when outside system-temp.
  Literal redirects to the `/dev/null` character device discard output; other
  device mutations still need grants. Symlinks and removals use physical
  destinations; a scratch or host-scratchpad root that is itself a link, or
  not the session user's directory, grants nothing.
  The outside-write judgment holds from any working directory
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
  one agent judges several items, never one agent per item per pass. A Codex
  lifecycle dispatch reserves the writer and refuses a foreign holder; its
  other duties, grants and advisory cap remain role text, without tool-call
  or outside-write hook enforcement; other judgments delegate to host permissions; the default gate holds the suites that
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
  PostToolUse observers emit no advisory; after a shell command the read
  observer may hand the agent what the shell said about it, as context only
  [WO-172-D037, 2026-09-29]. If marker storage is unavailable,
  the message remains visible. SessionStart reuses the session handler to compare
  built bytes and the pinned snapshot, without dispatching work. `resume` and
  `plan start` diagnose runtime drift without building. Release close and worktree
  finish rebuild after their fast-forward when pins differ, preserving publication
  preflight ordering and the worktree on build failure. All roles retain supplied
  model and effort with source `operator-attested` when effective readback is
  unavailable; only an unsupplied value is `unknown`. Authorized product-document
  edits are followed by `npm run publication:check`. See
  [WO-133 decisions](../evidence/WO-133/decisions.md).
- **Codex continuity after compaction.** The Codex contributor bundle uses
  `PostCompact` to record the turn and `SessionStart` with `source: compact`
  to restore its saved unfinished work order as developer context
  [WO-054 scope expansion, 2026-09-18]. An old side question does not replace that task.
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
- **Write once, run once (WO-132).** Handoffs stand on the passing complete row, or on the structural phase and
  the declared Preflight suites, and on the document row recorded for the
  working tree as it stands, all at the current identity. `npm run sync`
  refreshes stale publication and bookkeeping artifacts before those checks;
  a selection compiles a stale runtime itself.
  The reviewer stages intended new source files, integrates main, formats and
  reuses the passing complete review row at the integrated code identity
  when one exists; only when none exists it starts `npm test -- --review`
  once in the background after the last source edit. The completion consumes
  the newest complete row at that identity, whichever role recorded it. The runner records `npm test` by tracked and non-ignored untracked code paths
  and bytes, independent of staging. Symbolic source aliases refuse the key
  rather than silently omitting their target bytes. The identity excludes `docs/` except
  `docs/control/outward-vocabulary.json`, `.claude/`, `.agents/`, root Markdown
  and the paths Git marks
  `dotln-generated` or `dotln-documentation`; the package READMEs no suite
  reads carry the documentation mark in `.gitattributes`, while a README or
  Markdown file a test reads as an input stays unmarked and counts (WO-115).
  Product tasks reject observed Node content reads of excluded tracked
  inputs and listings of the directories below the root that hold them, and
  observed reads, metadata probes, listings, watches, copies and links of
  the active order’s record directories, including untracked records and a
  recursive walk from the repository root or an ancestor. Copy sources of
  excluded tracked inputs, shell commands, native tools and Node children or
  workers started without the inherited options are not judged:
  `license-fixtures`, `worktree` and `release` copy `docs/LEGAL.md`, and
  `release` copies `docs/releases/tag-manifest.template.json` and
  `docs/control/budgets.json`, so a reused row does not answer for those
  bytes (FUP-b28b870422a74166). Only tracked excluded inputs are inventoried;
  untracked ones remain unguarded until staged. Record roots guard prospective
  paths. License
  surfaces, resume, resident binding, local runner qualification and the
  artifact corpus run in the document gate with the `[document]` package
  cases, including kernel. Outward descriptions, lint and target publication
  retain product coverage with their vocabulary included in the identity.
  The exact tested tree remains beside that key. New source bytes
  require a new final product gate; report/control/index/release-text and
  marked-documentation edits do not. A passing final review recorded while no
  gate row matched the identity carries no product gate; `resume correct
  --set productGate=<evidenceRef>` binds one, once, from a passing gate whose
  identity is the one the pass recorded in its checkpoint and still the
  working tree's, and `worktree publish` and `release close` read the bound
  row from the committed correction. A subject changed after the pass takes
  a fresh final review (`activate` is legal from `closed`). Feedback on a merged pull request after the pass has three routes: board it as a follow-up and merge; push a documentation-only correction to the branch, which leaves code identity unchanged; or a second cycle by `activate` from `closed`. A second `worktree publish` on a branch whose pull request is open pushes and then fails at creation with nothing recorded (observed 2026-10-16; FUP-1241a4d027a07dce carries the repair). The executor and
  each repair run the structural phase and the order's Preflight suites
  before handoff, the verifier consumes those rows and probes with `--only`,
  and the complete gate runs once at final review (§Preflight before the
  full gate).
  WO-133 keeps the host and both profiles' skeleton version in
  `packages/skeleton/src/version.ts`, outside machinery source declarations but
  inside runtime pins. Review selection uses the existing evidence content
  projection for compiler/package version literals, so version-only bumps select
  no machinery suite; a host behavior edit still selects its declared suites.
  Lifecycle transitions run the inline whitespace check and record their
  reports/attestations without read or usage prerequisites. The executor
  completions also read `docs/evidence/WO-NNN/handoff.md`, one line per
  declared criterion in the report's forms [WO-173, 2026-09-28]: a criterion
  recorded met that names `npm run test:docs` consumes the latest passing
  document row at the current code identity; one that names `npm test` or
  `npm test -- --review` consumes the structural row, the order's Preflight
  rows and the document row at that identity, or a passing complete row
  that covers the change's review selection (§Preflight before the full
  gate); one recorded unmet always records and is shown at the next dispatch. `npm
  test` runs only the selected tasks whose latest recorded run at that
  identity is not a pass, and records a complete row in which each carried
  result names the row that executed it. A later failed or timed-out run of
  a task, in a gate or in a failed single-suite, machinery or partial run,
  and a later failed gate are never masked by an older pass; a carried
  result is never itself evidence. A stop or signal after a task completed
  records the completed tasks as a stopped row, which supplies no pass; a
  stop before any completion and errors in final identity, deadline parsing
  or index locking leave no row and displace nothing. Both lookups choose worktree executions first, across
  checks. A row stands while each task's latest run supplies its result or
  a pass that may be carried; integrity failures displace their executed
  tasks. Identity errors (including symbolic aliases) and unreadable consulted
  main indexes retain the storage-unavailable contract: `Gate index unavailable`
  names the error, leaving an actor-stated unproved claim with no product gate.
  Passing tasks may compose after an unchanged-code failure; partial results
  never reuse. A carried build beside a running task requires its ignored
  output's digest to match disk; otherwise it runs first. Changed output at
  gate end fails the row. With no task to run,
  nothing builds. With no local
  row at the identity, a worktree reads main’s index through the common Git
  worktree registration, without writing to main; a pass it carried from
  main is checked against main’s latest execution at each later lookup;
  unresolvable main leaves the worktree’s own rows.
  `--again` always runs every selected task fresh; review selections may reuse
  eligible passing tasks. Review selection diffs against the
  merge base, retaining the worktree’s changes when a sibling advances main.
  During a product gate, roles may write only the active order’s evidence,
  verification and final-review directories at the default document roots;
  relocated record roots retain the full refusal until the identity and read
  boundary support them together. Observed content, presence and descriptor
  metadata reads fail product tasks, including physical aliases and prospective
  report paths. Every other gate input and the success record stay protected.
  Document and mixed review gates retain the full write refusal.
- **Host-confinement preflight.** `scripts/lib/host-confinement.mjs` detects
  a host restriction; it creates no sandbox [WO-140, 2026-09-19; renamed by
  WO-161, 2026-09-25]. The operator's three CLI sessions currently run
  without a host sandbox; the detector reports `inForce: false` here. A suite
  declares
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
  needs the outside pays for the probe. `npm test -- --confined-partial` runs
  the remaining suites. Its recorded identity stays
  `npm test -- --inside-sandbox`, with `partial` and `excludedSuites`, never
  `npm test`; the declaration `needs: outside-sandbox` and diagnostic field
  `sandbox` also retain their historical names for existing records.
  `findGateCheck`, the lifecycle transitions, pull-request
  publication and release close reject that row, and reject exclusions under
  any identity. Run the product gate with `npm test`; if the runner reports
  confinement, use the printed outside command under the host's permission
  settings and existing authority. A resident-launched verification unable to
  run the full selection uses `--confined-partial` and reports its exclusions.
  A partial result is never product-gate evidence. See the
  [WO-140 decisions](../evidence/WO-140/decisions.md).
  The runner's host-confinement fixture disables Git's automatic maintenance
  before its first commit (WO-157, from WO-063 D005): Git 2.55 estimates loose
  objects from `objects/17` alone, so two loose objects there made a fixture
  commit start a detached geometric repack still writing `.git/objects/pack`
  when the teardown removed the tree (`ENOTEMPTY`). Each gate tags the
  `dotln-host-confinement-*` roots its suites create and fails, naming them, when
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

- **Build publication.** Compile into staging with the existing Node
  toolchain, replace each complete output file atomically, and finish the
  build barrier before dependent application commands run [operator decision,
  2026-09-09].
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
  `npm test -- --list --review` includes every available machinery declaration
  for Preflight discovery. Add `--selected` to list only the suites that would
  actually execute; handoff and final-review claim checks use that view so an
  unselected machinery suite cannot invalidate a passing review. The modifier
  requires `--list` and never starts a gate.
  Suites run fresh in the working tree, one task per suite except independent
  release cases, which share a prepared synthetic template and run in multiple
  lanes. Replica copies, declared-input keys, shared success cache, kernel-denial
  probes and their machinery-only tests are removed. `npm run test:machinery`
  runs the machinery suites on demand; the reviewer's `npm test -- --review`
  includes them only when their own declared sources changed since the base.
  A runner fixture checks direct entry imports and literal script paths against
  those sources or reasoned exclusions; transitive and computed paths stay
  outside the check (WO-174).
  Document-sensitive live checks remain in `npm run test:docs`.
  An exported instance consumes that tested platform: its ordinary plain and
  review selections run the six structural tasks, whose `generated` check
  covers the active installed bundle, and `kit-verify` fresh, checking
  carried compiled files. Its document selection
  runs current coordination checks without platform fixtures. An upstream
  update or missing comparison ref never expands these consumer defaults.
  Runner selection and evidence use one package-source predicate. Runtime
  identity binds declared regular workspaces, package metadata and their compiled
  `dist` or build-free `src`, with execute permission represented as a boolean.
  Inventory, snapshot copy, snapshot checking and input digests omit dot-prefixed
  runtime entries and `.tsbuildinfo`; other ignored runtime files still count.
  Ordinary files directly under `packages/` are not workspaces; malformed
  declared inputs refuse by relative path. Hidden runtime payloads would require
  reopening this selection rule. Generated harness surfaces retain their own
  complete input inventory.
  Sibling implementation claims use the registered target gate at that
  sibling's bytes; a starter runtime pass cannot satisfy them. Carried
  platform fixtures remain explicit `--only` or `--machinery` diagnostics,
  with order-specific evidence required for intentional machinery changes.
  The scheduler retains load-derived deadlines, peer observations, host-derived
  lane capacity and bounded live progress. Harness fixtures, process-debt and
  worktree-integration keep an exclusive reservation with up to two measured
  light peers. The older WO-128 D010 comparison (462 seconds exclusive versus
  666 shared) remains historical evidence for retaining their reservation. Skeleton remains shared: WO-115's
  [same-source comparison](../evidence/WO-115/scheduling-comparison.json) passed
  all 28 suites in 312.441 seconds shared and 430.952 seconds exclusive, with
  only its isolation declaration changed. Isolation shortened skeleton itself
  from 309.511 to 286.508 seconds but added 118.511 seconds to the complete
  gate. Shared skeleton has priority 80, reserves one host lane and uses
  twice the scheduler concurrency as its deadline load factor; exclusive
  skeleton without overlap would take priority 200 before shared suites,
  reserve every scheduler lane and use factor 2. Each lock-matrix
  cell now has its own 120 s deadline (WO-173). This single ordered pair
  supports retaining shared scheduling; it does not establish the historical
  timeout cause or reliability under all host loads. Future scheduling changes
  require a same-source comparison. WO-132's acceptance target was three consecutive
  fresh product gates below 360 seconds on the operator's host; its evidence
  records 254.908, 250.500 and 246.160 seconds. That historical product
  selection is not the later complete-review selection. No product test is deleted; product-test removal still goes
  through the mutation corpus. The immutable WO-129–WO-131 records describe
  the former implementation, not current reuse behavior.

- **Return shape.** End with a compact result: what changed, evidence pointers,
  deviations from the work order, open questions. Terse; no narration theater,
  no apology theater.

### Preflight before the full gate

Every selection begins with six structural tasks, in order: `format`,
`configuration-root`, `registrations`, `declarations`, `generated` and
`host`. They finish before a build or selected suite starts. Declarations
check machinery inputs and declared copied-fixture closures. Generated
checks retain their own short deadlines and name all stale artifacts in the
row; `npm run sync` regenerates them in dependency order and changes nothing
on a second current run. Only a recognized stale report authorizes a writer;
crashes, timeouts, unreadable inputs and unrelated failures refuse regeneration.
Sibling pages and tag observations, and a missing work-order tag snapshot,
are regenerated through their declared index writers.
A selection first compiles a stale runtime with
the build, whose output lies outside the code identity, so an ordinary
package edit reaches the suites; a stale installed harness is reported and
never installed by a gate, since live hooks change only through the explicit
`npm run sync` step. A focused product selection judges only those two
generated artifacts, publication and bookkeeping being inputs of the
complete and document selections, and its structural row is partial: it
never stands in for a complete or document selection's structural pass. A
later passing partial row preserves an earlier complete pass; a later failed
partial task still displaces its prior pass. In an export, `launchpad update --finish` fetches and fast-forwards clean
main before bootstrap, and release-close recovery, `worktree finish` and
`npm run harness` restore the verified carried runtime instead of building
omitted sources; bootstrap is the named manual recovery command (WO-226).
Sync refuses a role oracle without its authorizing
update, a feedback edition whose judged sources require a live episode,
and manual baseline fingerprints. Host admission refuses measured warning
or critical memory pressure and records its sampled values.

Each order's **Preflight:** field names the suites its change touches, each
as `npm test -- --only <suite>`, the spelling the handoff reads. The
executor and each repair finish formatting and regeneration, then start one
complete run, `npm test -- --review`, in the background and never under the
bounded probe wrapper. The complete run schedules first the suites whose
latest execution failed, then those whose inputs changed after the newest
gate row, then the suites this branch changed, so a stale assertion fails
within minutes rather than at the end of the run. A complete run composes
nothing from `--only` rows: a focused pass of every Preflight suite followed
by a complete run executes each suite twice, so `npm test -- --only <suite>`
serves to reproduce one failure, not to precede the complete run. After the
complete run passes the role writes its report, since a review gate admits
no record writes while it runs and a judgment is written with its evidence;
`npm run test:docs` runs once after the last document edit; then the result
is recorded. Completion consumes the passing complete row at the current
code identity, or the passing structural and focused rows there, together
with the newest passing document row recorded for the working tree as it
stands (the row's tree hash), records their evidence references and runs no
gate itself: a document edited after its document run is refused by name,
and the recording itself changes nothing the row judged. The verifier consumes
the same rows and reproduces a finding with `--only`. A queued order's older
instruction to follow Preflight with a complete run is read under this
handoff rule.

Final review integrates main and rejects a known-bad candidate before the
expensive validation: each blocking claim of the verification sequence is
reproduced with `--only` or the bounded probe route, and a reproduced
blocker goes straight to a truthful failing review and its repair, without
a complete run. Otherwise it finishes source edits and formatting, then
reuses the passing complete review row at the integrated code identity when
one exists, whichever role recorded it: the identity, not the dispatch time,
says what was tested, so under serial orders an integration that brought no
change costs no second run. Only when that identity has no passing complete
row does it start `npm test -- --review` in the background, never under the
bounded probe wrapper (which applies a six-hour outer bound to a complete
selection instead of its 900-second probe deadline),
awaiting it with `node scripts/harness.mjs evidence --wait`. The FINAL
report, PR.md and RELEASE-NOTES.md are written after it passes, since a
review gate admits no record writes while it runs and a judgment is written
with its evidence;
`npm run test:docs` runs once after the last document edit; then the
result is recorded. Completion consumes the newest passing complete review
row at that identity and the newest passing document row recorded for the
working tree as it stands, and runs no gate itself; a newer failed run at the same identity displaces an older pass. No
pass crosses a code identity. Source changes require a complete row at the
new identity; report and generated-document edits do not. Target orders
retain their repository's declared target gate and the launchpad document
gate.

Scheduling adds priority leads to each task's declared priority: unresolved
failures receive 3000, sources changed since the last product gate receive
2000, and older branch changes receive 100. Failed and newly changed suites
lead; the smaller branch lead lets unchanged exclusive work precede shared
branch work, while preserving branch work's priority over ordinary unchanged
shared work. The scheduler stops starting tasks after the first
failure, lets running tasks finish, and records the first failure and unrun
tasks. `--keep-going`
continues independent work without bypassing failed prerequisites. A stop
request or SIGINT, SIGTERM or SIGHUP records only tasks already finished,
with `stopped: true`; a stop before any completion records nothing. A stopped
row supplies no passing claim. An execution finishing after its row was
recorded also supplies no pass. Launchpad declares its files in
update/refresh, export/verify and seeds/staging order, at most two at a time,
each with its own 900-second deadline and two host slots. Measured light
files can still run first beside an exclusive task. Declaring the longer
update file first aims to reduce the tail when only one heavy file fits;
the required tasks, assertions and admission limits are unchanged.

The host-lane registry records the first acquirer's capacity, the lesser of
eight and half the logical processors, at least one; later clones inherit
it. WAIT lines label each holder's relation to this checkout; the summary and
recorded `hostLaneWait` report the union of wait intervals, with overlapping
relation-specific unions. Compact relation changes retain attribution beyond
the 32-entry detailed diagnostic cap. Unknown includes lock waiting and time
before the first capacity observation; legacy rows have only their retained
history. `node scripts/harness.mjs lanes` reads live
holders and recorded capacity without taking the lock or changing records;
its snapshot can be transient. The slow document condition shows wall-clock
and execution-only medians, marks contended samples and judges execution cost
on the latter (WO-229 D001); failed samples remain unavailable.

At the measured eight-slot capacity, structural host requests are `format` 3,
`configuration-root` 2, `registrations` 2, `declarations` 4, `generated` 2,
`host` 2, `kit-verify` 2.
These requests are capped by the available local reservation on smaller hosts;
the local serial structural phase keeps every local lane. The
[measurement and sizing decision](../evidence/WO-229/decisions.md#wo-229-d002)
retains CPU, RSS and wall observations. The operator-authorized declarations
exception in [D022](../evidence/WO-229/decisions.md#wo-229-d022--authorize-declarations-at-its-measured-four-slot-need)
uses its measured four-slot need, including CPU headroom and the memory screen;
other tasks retain the strict half-capacity criterion. The staggered sibling
fixture bounds document waiting below the complete gate's longest task and
asserts further complete-gate admissions after the last document admission. Admission still has no
fairness guarantee. A task's memory budget is the gate share divided by that
capacity, and the host
structural task compares it with the maximum task RSS in the three baseline
passing rows. A refusal names `memory.gateShare` and the minimum share that
would admit that observed peak at the recorded capacity; it also says when
that value exceeds `memory.hostShare`. The operator can increase the gate
share only within the host share, or use a host with enough memory. The screen
retains its observed-peak limit; it does not assert a future worst case.

Session registrations and unwrapped bare work use the per-lane task budget,
not the whole gate share. They represent one task without a measured parallel
gate reservation; granting each a full gate share would multiply permitted
memory outside admission. The bare-group limit is the least live registered
task limit, capped at the default physical-memory task share.

The three exclusive suites keep a full host reservation and lend nested
leases to their own task and up to two local light peers. Another gate cannot
fill the reserved overlap with heavy work. Only shared tasks whose every
held baseline sample is below 60 seconds and 512 MiB RSS may use those spare
lanes. The exclusive task's
shared deadline declaration has at most three concurrent tasks and a factor
twice that declaration, up to six; nested gates remain inside its inherited
reservation. Target-worktree's
start, publication, close and release files run two at a time, each under
its own 900-second deadline, preserving the base's complete case inventory.
The [WO-222 measurement](../evidence/WO-222/README.md) compares these levers
with a before median of 2,538.373 seconds and a three-fresh-run after median
of 1,668.518 seconds, 34.2682% lower, with no outer task deadline hit. The
combined comparison retains all three levers; it does not isolate their
individual contributions. Summed task duration increased, and the target-worktree
group span improved by 9.24%; the evidence keeps those tradeoffs and the
reversal condition alongside the complete-run gain.

The maintained [gate-execution architecture record](../architecture/gate-execution.md)
connects earlier scheduling and reuse decisions, their measured reversals and
research from books and public implementations. Orders changing these surfaces
cite and update that record alongside their ordinary decision files. It separates
the implemented capacity and file lanes from proposed fair host admission, its
mixed-version boundary and optional future host resource profiles.

The [WO-216 measurements](../evidence/WO-216/README.md) retain the base's
seven complete and seventeen document failures with their task timelines,
three timings of the reused checks it names (the `siblings` and
`baseline-fingerprints` checks were not timed at the base), the handoff
structural phase and its
individual tasks, and each split launchpad file. The base direct-check
medians were 7.204 seconds for formatting, 6.097 for configuration,
0.591 for registrations and 0.215 for declarations; no structural phase
existed at that base. The split file tasks measured 164.231 seconds for
export, 247.940 for update and 4.863 for seeds, each within its own
900-second deadline. The five closes after this order judge the design
against 11 complete runs, 1.3 late structural-class failures and 545 gate
task minutes per closed order. Any statistic not below its baseline reopens the decision; isolated check
timings do not establish that outcome. At the first of those closes
(WO-221, 2026-10-19) the window held fifteen complete runs (four stopped,
eight failed, three passed), no late structural-class failure and 691 gate
task minutes, under three operator scope expansions that changed the gate
process mid-order (WO-221 D016 to D020); the
[2026-10-19 pass](../planning/standard-pass-2026-10-19.md) §3 reads them,
and WO-222 takes the capacity levers D019 measured.

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

Spawned agents run the operator's pinned models (direction of 2026-09-30): a
worker, reviewer, refuter, live episode or probe that a session launches runs
Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`.
Claude workers use the generated `.claude/agents/dotln-worker.md` type:
`model: claude-opus-5-5` and `effort: xhigh`. Launch Agent with
`subagent_type: dotln-worker` and no per-call model override; its definition's
effort overrides the root's effort. The host's [subagent documentation](https://code.claude.com/docs/en/sub-agents)
documents both fields, per-call model precedence and `/tasks` model/effort
readback (checked 2026-10-05). Codex workers use `spawn_agent` with
`fork_turns: none`, `model: gpt-6.1-sol`, `reasoning_effort: max`; use the same
pin for adversaries, reviewers, refuters and research. Generated-definition
and call arguments are launch selections, never proof of effective effort.
Report the host's readback or that it reports none; a root's own selection
does not decide the worker's. A script that regenerates a dated record keeps the
model that record names and says so beside it; the attestation records what
ran.

The opt-in Claude type `.claude/agents/dotln-worker-fable.md` selects
`claude-fable-5-1` at `xhigh` only when the operator's `planning:` or
`resume:` dispatch line names `fable` or `fable 5.1`. Use that type without
a per-call model override. `dotln-worker` remains the default and the Codex
pin above is unchanged. The parent records the type that ran in its response
and the direct refutation receipt's `workerType`, passing `--worker-type
dotln-worker-fable` to `plan receipt` for the opt-in; an omitted option
records `dotln-worker`; Codex passes `--worker-type codex-spawn-agent`
to record its actual launcher. This field attests to the launch type, never to
effective model or effort. Older receipts lacking it retain their original
bytes and do not acquire invented readback (WO-226).

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
