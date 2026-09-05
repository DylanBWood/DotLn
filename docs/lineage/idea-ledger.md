# DotLn Idea Ledger

Append-only. Every significant idea from the founding corpus (11 ideation chats,
4 notes files, 46 images, extracted 2026-08-30) gets one entry and a lifecycle
status. **An idea may be superseded but must never disappear** — this ledger is
the mechanism behind the anti-recency directive ("i liked a lot of the
intermediary ideas so let's not have such a recency bias").

Statuses: `adopted` (in the blueprint now) / `preserved` (available, pull in on
contact) / `raw` (recorded, unendorsed GPT elaboration) / `superseded` (replaced
by a later decision — the superseding entry is named) / `transformed` (adopted
in generalized form; the transformation is described).

Provenance: `recovered` = absent from the GPT-era north-star doc and recovered
here; `north-star` = carried in it; `tension` = conflicted with it (resolved in
the Resolutions section).

**Order: newest section first.** Sections run reverse-chronologically, so the
most recent thinking is at the top and the founding corpus (Chat 001 onward)
is at the bottom. Entries keep their original order *within* a section. Append
a new session's section directly below this header, never at the end of the
file. Two standing reference surfaces sit at the very bottom because they are
founding-era: **Resolutions of known tensions** (settled contradictions — do
not relitigate them) and the founding chat/notes/image corpus.

## 2026-09-05 WO-030 work-order splitting and UIFA assurance ideation

**Provenance:** the operator's two `ideation:` entries during WO-030 execution,
captured unedited in local-only
`docs/intake/notes/WO-030-expanded-ideation-2026-09-05.md`, SHA-256
`858b8458926d8bed33db88c1e2b8f5156413e9f00a7f33ad2e20af10b0462255`.
Shape-First Synthesis under the saved public Clean Room loadout; no direct-filing
exception or employer-derived implementation. The clean-room screen found no
stop condition. The work-order receipt records preservation and review.

- **One outcome, alternative whole or child routes** `preserved`
  - Any order can be considered for decomposition into smaller reviewable
    increments under one umbrella. Whole and split plans may both be available
    before execution, but starting one route excludes the other. Starting the
    first child permanently prevents executing the original whole route; the
    parent survives as the addressable outcome and evidence rollup.
  - Product 06 records this future behavior. Stable opaque identities and
    historical evidence remain intact; suffix labels do not select a new ID
    grammar. The exact selection transition, active/historical-order treatment,
    nesting, and aggregate lifecycle remain planning choices.
- **Suggest useful boundaries, including no split** `preserved`
  - A proposal should expose acceptance coverage, dependency edges, integration
    risk, and expected review size. An atomic order can stay intact. Serial,
    parallel, and mixed child plans are possible when dependencies and shared
    resources permit; hierarchy alone says nothing about concurrency. Smaller
    increments serve the same outcome without requiring a new commit policy.
- **UIFA responsibility for security, identity, and observable evidence**
  `preserved`
  - Product 13 adds the operator's requested human perspective on security,
    authentication, authorization, logs, and traceability. Product 09 connects
    it to the existing audit/privacy distinctions. Names and one-versus-several
    hats remain open; the five confirmed roles and domain `Role` stay intact.
  - One assurance hat or separate boundary/identity and logs/traceability hats
    are synthesis options only. Claims of identity, effect authority, current
    diagnostics, and outcome evidence answer different questions; no title
    creates permission or mandates a new approval layer.

## 2026-09-05 WO-030 concurrent-control implementation

**Provenance:** operator `resume: next` dispatched the activated WO-030;
implementation derives from that authority and the concurrent work-orders plan,
without new intake or employer-derived material.

- **Order identity owns history; selection only chooses a view** `adopted`
  - New orders use one JSONL segment each. Existing legacy activations finish
    where they began; reopening the same identity keeps that ownership. The
    shared event switch retains each order's state, evidence, actor, failure
    source, and checkpoint independently. Every order keeps the existing phase
    contract; there is no workflow-schema extension.
- **Compatibility without historical migration** `adopted`
  - The 153-event activation prefix has a captured v0.6.0 fold comparison and
    byte-identical timing observation. Storage changes without moving event
    schema 1, legacy ordinals, or source bytes. New timing rows name their
    segment; clocks never sequence independent histories.
- **Integrate histories serially and regenerate the views** `adopted`
  - Real-Git fixtures retain independent states through serial merges, close
    one order while another remains open, and attribute distinct fixture
    releases. A third old-base branch preserves its segment and prefix proof.
    Tag snapshots name their contained segments. Shared projections describe
    the current checkout, not live unmerged sibling state. Independent review
    and a measured paired wave remain separate obligations.

## 2026-09-05 UIFA-roles planning pass (operator-dispatched, after the `v0.6.0` close)

Source: the operator's 2026-09-05 dispatch for a deliberately larger planning
session, carrying ten `ideation:` entries in the same message, preserved
verbatim in local-only
`docs/intake/notes/2026-09-05-planning-session-uifa-roles-ideation.md`, SHA-256
`0e946d82dc426dfd066157a0affcd7b0dc4debd53bdf9741a8bf57d21272985f`. The
ideation synthesis is the sibling section below; this section records the
planning results. The pass ran on the clean `main` checkout between work
orders with Beware of Naive Interventionism and Do Nothing equipped, filed two
planner-synthesized drafts, changed the recommended sequence once, and recorded
a NoOp with its reversal condition for every candidate it declined.
Identifiers are opaque stable references; a recommendation records a finding
and a bounded route, not activation authority. The clean-room screen found no
employer, credential, internal-service, or other stop condition; the two
example addresses in the raw message are placeholders and were not promoted.

- **A planning pass is a documented dispatch, not a mode to guess at**
  `adopted`
  - This is the fifth planning pass and the first opened by an operator who
    did not know whether to invoke the Repo Gardener, the Entropy Reducer, or
    something else. The procedure existed only as ledger precedent. Product 07
    gains §Operator-opened planning pass (trigger, inputs, stance, standard
    artifacts, limits, and how it differs from an Entropy Reducer review and
    the skeleton's Gardener identity); `CLAUDE.md` §Start here names the
    `planning:` prefix; the playbook points at both. A typed mechanism is
    deferred until the documented procedure exposes a repeated mechanical step.
- **The concurrent-workflow handoff is discharged into one bounded first
  slice** `adopted`
  - `docs/planning/concurrent-work-orders-plan.md` answers the ladders
    document's nine required planning results and files WO-030: one
    append-only control segment per order, legality scoped to the named order,
    a selected-order projection with `orders[]`, per-segment append-only and
    release-attribution proofs, and a two-branch integration fixture. Lane
    generation, admission control, declared per-order workflows, contribution
    tracks, and tenant-scoped tracks remain unfiled, each with a filing
    condition. Hand-executable lane rules give the first paired wave.
- **WO-030 precedes WO-021, and the paired trial follows it** `adopted`
  - The one sequence change. WO-021's per-transition beacon and group composite
    assume per-order state, and the ladders' paired trial cannot run on a fold
    that lets a second activation capture the first order's events. The
    recommended sequence is WO-030 → WO-021 ∥ WO-029 → WO-009 ∥ WO-031 →
    WO-022 ∥ WO-010 → WO-011. Reverse by running WO-021 first if the operator
    prefers Beacons dogfood before concurrency; nothing else moves.
- **Actor usage becomes a read-only projection with an opt-in opaque account
  label** `adopted`
  - WO-031: `resume usage` groups completed phases by harness, version, model,
    effort, label, and phase across every order, from `recordedAt` and the
    attestations that already exist. The label is opt-in, matches a short
    lowercase grammar, and means nothing outside the repository; its mapping
    to an account is a hand-maintained ignored local file no script reads.
    Product 09 preserves the candidate; the order carries the two-accounts
    disclosure note. No token, cost, or attention field is added.
- **The editor diagnostics are a TypeScript default change, not a missing
  linter** `adopted` `recovered`
  - Reproduced 2026-09-05: the pinned TypeScript 5.4.5 builds every package
    clean, while TypeScript 7.0.2 (the current `latest`, the native port an
    editor is likely to bundle) reports `Cannot find name 'node:test'` and,
    downstream of that, `Property 'semanticHash' does not exist on type
    'CompileResult'` — once `@types/node` is no longer included implicitly,
    `assert.fail` loses its `never` type and the tests' narrowing collapses.
    Passing `--types node` makes 7.0.2 clean on all three packages. The fix is
    `types: ["node"]` in each package `tsconfig.json`, nominated as a bounded
    boy-scout item for the next activated order rather than edited on `main`
    by a planning pass. ESLint is not adopted; ADR-0002 records the posture.
- **Declared cost is the prior; the profiling track supplies the observed
  column** `adopted`
  - The compiled tooltip's `COST` lines (mechanism, prompt tokens, runtime
    operations, episodes per support) are static claims the operator can read
    before a build runs; WO-107's harness supplies the observed vector. Product
    06 states the loop the operator named — data, experiment, analysis, change
    or report, repeat — as declared-versus-observed cost. The adjacent-track
    recommendation therefore moves to WO-107 first, with WO-108 the alternative
    when evidence quality is the concern; reverse if the operator wants the
    mutation findings before the first baseline.
- **The tree at `v0.6.0` is healthy** `adopted`
  - `npm test` is green at this revision with the planning edits applied
    (recorded in the session result); `git worktree list` shows only the main
    checkout and `git branch` only `main`; the only non-doc change this pass
    identified is the one-line TypeScript configuration item above.
- **Role names confirmed: product lead and showrunner; stickiness is the
  naming criterion** `adopted`
  - Source: the operator's same-day reply, preserved verbatim in local-only
    `docs/intake/notes/2026-09-05-uifa-role-names-decision.md`, SHA-256
    `17a832894edd98b87d43976b8900a63de9082f9baabcdf2df8c21e54617a1eca`. The
    operator chose `UIFA product lead` over `product owner`, briefly considered
    ending all five names in _lead_, and withdrew that in favor of keeping
    `UIFA showrunner`; engineer, tester, and devops stand as given. The
    confirmed set is product lead, showrunner, engineer, tester, devops, with
    `UIFA conductor` recorded as the alternative not taken. The operator
    remains open to stickier names in the sense of Gladwell's stickiness
    factor; the inspirations register records that criterion, and any rename
    lands as a dated note in product 13 and here.
- **WO-030 is pinned at `v0.7.0`** `adopted`
  - The next minor above published `v0.6.0`, assigned under the operator's
    opt-out default because WO-030 is the recommended next activation and the
    operator asked for the post-merge steps. If WO-021 runs first instead, the
    target is retimed with a dated note per 06 §Release boundary; nothing else
    in the order changes.
- **Declined candidates, each with its reversal condition** `preserved`
  - Filing the lane-plan generator, admission policy, per-order workflow
    declaration, contribution tracks, or tenant tracks now: NoOp; the plan
    names a filing condition for each, starting with one paired wave run by
    hand under WO-030.
  - Filing a harness-versus-API comparison order: NoOp. No comparable cells
    exist until WO-009 lands two transports; the comparison then becomes a
    WO-107-style profiling cell, per the candidate in product 03.
  - Adding ESLint or a lint dependency: NoOp; strict `tsc`, Prettier, and the
    evidence suites are the gate. Reverse when a repeated defect motivates a
    specific self-written check.
  - Editing the three `tsconfig.json` files on `main` in this pass: NoOp;
    configuration that changes the build is implementation and lands through a
    work order's evidence, as a boy-scout item at the next activation.
  - Committing editor settings that pin the workspace TypeScript: NoOp; the
    `types` field removes the divergence and editor configuration is
    operator-owned. Reverse if a second editor-only divergence appears.
  - Modeling the five UIFA roles as domain entities or events: NoOp until a
    consumer needs a human role as data, for example tester-authored scenarios
    in WO-011. Reverse at that consumer.
  - Token, cost, or attention telemetry in the control log: NoOp, unchanged
    from the 2026-09-03 pass; WO-031 records only elapsed time and an opaque
    label.
  - A `planning:` resume command or typed dispatch: NoOp; prose projection
    first, as ideation mode was. Reverse when the third pass under the
    documented procedure shows the same mechanical step repeated.
  - Retiring or rewording WO-014: NoOp; it remains a floating option when
    approval friction is the constraint.
  - Confirming the two proposed role names: not the planner's to decide, and
    decided by the operator the same day; see the confirmation entry above.

## 2026-09-05 planning-session ideation — five UIFA roles, actor usage, authorship, harness choice, dependency posture, positioning

Source: ten `ideation:` entries in the operator's planning dispatch, preserved
verbatim in local-only
`docs/intake/notes/2026-09-05-planning-session-uifa-roles-ideation.md`, SHA-256
`0e946d82dc426dfd066157a0affcd7b0dc4debd53bdf9741a8bf57d21272985f`. Clean
Room found no stop condition; the two example account addresses are
placeholders and appear in no committed surface. Shape-First Synthesis
rewrites the operator's meaning for public docs; no direct-filing exception is
invoked. The planning results that followed are in the section above.

- **Five UIFA roles name the humans around an agentic platform** `adopted`
  `transformed`
  - Transforms the founding **Two-role future org** entry (Notes 001,
    `preserved`), which sketched a product person and an architect-plus-scrum-
    master, into five: UIFA product lead (first proposed as product owner; the
    operator chose _lead_ the same day because _owner_ already means an
    implementation's owner), UIFA showrunner (proposed and confirmed; `UIFA
    conductor` recorded as the alternative not taken), UIFA engineer, UIFA
    tester, and UIFA devops. Adopted for immediate circulation at the
    operator's direction. New product 13 carries the full treatment; the README and
    product 00 introduce it; the playbook points to it. Human job names, not a
    domain-model `Role`, an Actor primitive, or an organization chart.
- **The UIFA tester tests shapes, not software** `adopted`
  - The role tests whether a proposed shape, role, or support does what it
    should in the appropriate circumstances. Duplication is automated through
    replay, fixtures, verifier episodes, and paired counterfactuals; the person
    supplies scenarios a model would not think to try and validates outcomes
    themselves. Findings feed the feedback compiler, opinion cohorts, and the
    `προτείνω` scoreboard.
- **The UIFA engineer hand-crafts the actor experience** `adopted`
  - Identities, roles, supports, link groups, cadences, and temporal structures
    composed by a person from legos or custom pieces, rather than a model's
    guess at the mapping. The compiler's diff, tooltip with declared costs,
    semantic hash, and workshop are the role's assistance.
- **The showrunner's tooling is parallel workflows with per-release status**
  `adopted`
  - The operator observed that the architect-plus-scrum-master role is already
    served by parallel workflows, their status, and what each release
    contained. Product 13 maps the role to the generated index, the planning
    map, control status, release records, WO-030, WO-021, and WO-031.
- **The product owner's vision is transcribed and stored the way this
  repository's own docs are** `adopted`
  - The role keeps sharpening a future-state vision; the platform's job is
    fidelity and memory: intake, shape-first synthesis, the append-only ledger,
    and projections of what the fleet made of the words.
- **Humans stay in the loop because their priors differ from a model's**
  `adopted`
  - All five roles receive both ahead-of-time and just-in-time assistance
    (automation, visibility, understanding, creativity). People want to
    document, reuse, and explain, and also to play ad hoc; product 13 asks for
    unmistakable, cheap sandbox and preview surfaces so exploration is a
    first-class mode. Product 00's “secret sauce belongs to each
    implementation” now has a human location.
- **One person wears several hats; “UIFA programmer” is the umbrella**
  `adopted`
  - The operator's self-description — a UIFA programmer doing UIFA devops plus
    UIFA showrunner and dabbling in everything UIFA — is recorded as the
    intended public way of describing the work. Roles are hats, not headcount.
- **The roles are illustrated across many domains, not one industry**
  `adopted`
  - Product 13 maps the five roles onto a kitchen, a hospital ward, film and
    television, a classroom, a farm cooperative, an orchestra, a basketball
    team, and an open-source project, extending the founding “every reader of
    those books already knows a feature of the app” thesis to people who direct
    work in any domain.
- **Recorded time plus attestations already answer “which model, how long”;
  account distinction is opt-in and opaque** `adopted`
  - `recordedAt` and the actor attestation on every completion event make
    per-actor elapsed time a pure projection; WO-031 files it. Distinguishing
    two accounts of one harness uses an opaque public label whose mapping stays
    in an ignored local file; no email or account identifier enters the
    repository. The operator's meta-question (how to use allowances, whether a
    second subscription helps particular phases) is answered from that
    projection, not from telemetry.
- **Authorship for UIFA roles is multi-dimensional completion with compiled
  consequences** `preserved`
  - The operator's open question: what intellisense looks like in three or
    four dimensions, and how to keep the humans in flow. Product 04 preserves a
    candidate: completion along structure (what fits this socket), time (what
    fires next), consequence (declared cost, authority delta, evidence
    obligations — the tooltip's `COST` and `RESTRICTIONS` lines are the
    prototype), and history (what earlier compositions did here, first
    divergence), always as a proposal with a compiled diff, never a silent
    mutation.
- **Terminal harness, IDE extension, desktop app, raw API, and local runner
  are presentation surfaces of one model; differences are hypotheses**
  `preserved`
  - Product 03's runtime-primitive-catalog section preserves the candidate:
    each surface differs in system context, tools, permissions and sandbox,
    context construction, session persistence, readback, structured output,
    and accounting regime (subscription window versus metered tokens). DotLn
    records the surface used as an environment fact and measures claimed
    quality, throughput, accuracy, or cost differences in the profiling lane;
    WO-009's two transports are the first comparable cells.
- **Editor diagnostics revealed a TypeScript default change, not a missing
  linter** `adopted` `recovered`
  - The operator saw `Property 'semanticHash' does not exist on type
    'CompileResult'` in an editor while `npm test` passed. Root cause,
    reproduction, and the one-line `types: ["node"]` fix are in the planning
    section above; no linter was missing, and none is added.
- **Declared cost is the prior; the experiment loop supplies the observed
  column** `adopted`
  - The operator's reaction to the compiled `COST` lines and the loop “data,
    experiments, analyze, update or report or fix, repeat” is recorded in
    product 06 as declared-versus-observed cost, with WO-107 as the route to
    the first observed column and no new telemetry field.
- **Prefer self-written code; runtime dependencies stay at zero; vendoring is
  the exception, not the strategy** `adopted`
  - ADR-0002's amendments record the order of preference (Node built-ins,
    self-written code with tests, an exactly pinned dev-only dependency with a
    note, a runtime dependency only with a decision-record note), decline
    vendored minified CDN builds as unreviewable bytes with a license duty, and
    allow a small unminified single-file utility with its license text when
    that is clearer than a dependency.
- **DotLn is an agentic platform, not an agent, a harness, or an orchestrator**
  `adopted`
  - Product 00 §What DotLn is not and the README opening carry the operator's
    positioning: the platform hosts harnesses as observed environments and
    contains an orchestration layer, but is defined by the shared substrate on
    which people and software actors hold work, authority, and evidence.

## WO-020 name sound associations — 2026-09-04

Source: operator naming follow-up in local-only
`docs/intake/notes/WO-020-name-sound-associations-2026-09-04.md`, SHA-256
`e475a96fdf0bb88859d41f50d88bfd82194cdd68737a5df88330711af1386e7e`. Clean Room found no stop condition;
Shape-First Synthesis retains intended sound associations rather than requiring
literal linguistic identity across the referenced names.

- **Give UIFA a memorable rhyme and retain DotLn's software-name echo** `preserved`
  - Products 00/04 describe UIFA's proposed “wee-fuh” pronunciation by its rhyme
    with FIFA. Product 00 also records the operator's .NET/Kotlin sound
    association for DotLn. The earlier name origin and Actor UI concept remain
    intact. This is naming context, with no implementation or schema effect.

## WO-020 pronounceable interface name — 2026-09-04

Source: operator naming proposal in local-only
`docs/intake/notes/WO-020-uifa-name-2026-09-04.md`, SHA-256
`40dfb74a51a13d27c7d173ca239576a5df7db7ccdf06ce68337b45599f5b9534`. Clean Room found no stop condition;
Shape-First Synthesis applies with no direct-filing exception.

- **Propose UIFA, pronounced “wee-fuh,” for User Interfaces for Actors** `preserved`
  - The follow-up asks for a name people can say. Products 00/04 and audience
    routes preserve UIFA as the proposed spoken name for the Actor UI direction.
    The earlier AUI abbreviation remains historical naming context. This is a
    naming proposal, not a separate application, Actor schema, or implemented
    interface. The existing product and interface contracts retain their scope.

## WO-020 Actor UI direction — 2026-09-04

Source: operator terminology ideation in local-only
`docs/intake/notes/WO-020-actor-ui-2026-09-04.md`, SHA-256
`cf730baee6a0fa818c994285d7dc4956515bc20766a10db9d9452c075be5805d`. Clean Room found no stop condition;
Shape-First Synthesis applies with no direct-filing exception.

- **Name the future interface Actor UI (AUI)** `adopted`
  - Products 00/04 use Actor UI for the target interface direction, grounded in
    the existing Actor definition that includes people, model sessions, scripts,
    browser workers, and test runners. Roles, work, state, and evidence can be
    projected through the existing interface contracts, with interactions bound
    to capability and authority. Agent-specific views remain useful within the
    wider actor model. This is a terminology/product-direction clarification;
    the complete AUI is planned and no schema or screen is implemented here.

## WO-020 constraint-aware track admission — 2026-09-04

Source: operator constraint analogy in local-only
`docs/intake/notes/WO-020-constraint-track-admission-2026-09-04.md`, SHA-256
`a3cf1e580b54ba734cc145f7065345198c7c719422c974382d92bc5a94709222`.
Clean Room and Shape-First Synthesis carry the relationship described by the
operator; no quotation, detailed claim about the referenced book, or external
control algorithm is imported.

- **Govern track admission and activity by the limiting step** `preserved`
  - Open tracks, admitted orders, active steps, and completed throughput answer
    different questions. Products 03/06 and the Fable handoff preserve an
    observation/admission policy that can limit or safely pause upstream work
    when it would only accumulate before a constraint. Scope limits and reserves,
    retain pause reasons/state/resumption conditions, and account for unknown
    observations, moved constraints, fairness, and starvation. A bounded trial
    should throttle implementation when verification is constrained, then resume
    when capacity returns. The operator's utilization/activation distinction is
    a product objective; sensors, algorithm, thresholds, and implementation order
    remain planning choices. No automatic track control is implemented here.

## WO-020 tenant-scoped planning tracks — 2026-09-04

Source: operator follow-up in local-only
`docs/intake/notes/WO-020-multi-tenant-tracks-2026-09-04.md`, SHA-256
`eb87d89c71fb6e7141965e7405835756cf2e65415f254f15a3059470c3548eeb`.
Clean Room found no stop condition; Shape-First Synthesis carries coordinated
planning across scoped tracks, with no direct-filing exception.

- **Carry dependency and ordering plans across tenant-scoped tracks** `preserved`
  - Extend the concurrent-workflow candidate so each track carries required
    prerequisites and recommended order, and scheduling accounts for cross-track
    dependencies, shared conflicts, current capacity, and changing readiness.
    Products 06/12 and the Fable handoff preserve the distinction between
    required dependencies and recommendations. Tenant ownership, track grouping,
    visibility, authority, shared reserves, and schema representation remain
    explicit planning choices. Fixtures should expose cycles, stalled tracks,
    changed bases, and cross-track attribution. No multi-tenant runtime or
    automatic timing guarantee is claimed by the current implementation.

## WO-020 concurrent workflows, compatibility, and contribution tracks — 2026-09-04

Source: five operator follow-ups, preserved exactly in local-only
`docs/intake/notes/WO-020-concurrent-workflows-compatibility-2026-09-04.md`,
SHA-256 `b6e011c3635b1c91ccbfc8b7b620bcdef0b1551e4ba0d2ec76bb75b6eda2c788`.
Clean Room and Shape-First Synthesis retain the workflow, view, and attribution
relationships. A generic tracker analogy contributes no vendor terminology or
implementation details to the public model. These are ordinary ideation
messages, not direct-file public drafts.

- **Generalize concurrent control to zero to many orders with differing steps** `preserved`
  - Refine the earlier paired-ladder trial: two lanes are an initial capacity
    choice, and the example role sequence is not a global phase barrier.
    Orders have independent, declared workflows and can occupy different steps.
    Product 06 and the planning handoff ask Fable to define the enabling control
    change and bounded implementation orders, including rules that derive lane
    assignments from dependencies, conflicts, actor availability, and capacity.
    The current helper still has a single-current-order fold; this is planned
    behavior, not a concurrency claim about WO-020.
- **Choose compatibility per affected surface; derived views are an available technique** `adopted`
  - The operator delegates the tradeoff to planner/implementer judgment within
    scope. Product 10 clarifies that direct support, migration, adaptation, or
    an explicit unsupported boundary can each be appropriate. Existing
    acceptance and immutable evidence contracts retain their force. An optional
    computed or cached view maps preserved source entities to a target schema
    through named transformations, with fidelity, cache identity/invalidation,
    and unsupported reverse writes visible. No storage engine is selected.
- **Independent contributions share a progress view and attributable release history** `preserved`
  - Products 06/12 and the Fable handoff add public contribution tracks as a
    consumer of the concurrent model. The shared view covers known order state,
    blockers, evidence, and freshness; release views connect included reviewed
    changes to their orders. Completion, integration, and publication retain
    distinct evidence. Contribution/group/sub-task mapping and generalized
    release membership require planning; the existing generated index and
    immutable release records are the starting point. The reached application
    description now correctly identifies WO-026's index as delivered.

## WO-020 budget windows and paired ladders — 2026-09-04

Source: exploratory operator ideation preserved in local-only
`docs/intake/notes/WO-020-budget-window-parallel-ladders-2026-09-04.md`,
SHA-256 `7ab2e947106494d0738a35b2c90c86a9f7b3efb5ac5d00d91d2744026bd85978`.
Clean Room and Shape-First Synthesis carry the scheduling/attention objective;
provider limits and extra resets are separately labeled observations, not
architectural constants or employer-derived design.

- **Concentrate useful work early to create an uninterrupted period away** `adopted`
  - Clarify the operator's implementation preference: consuming an allowance
    early can be useful when it completes valuable work and releases attention.
    This refines the resource-pressure candidate's objective; it does not
    select a universal conservation policy or reward waste. Actual resets and
    confirmed extra capacity are event inputs, not expected free replenishment.
- **Compare one work-order ladder with two bounded phase batches** `preserved`
  - A concrete planning artifact splits the current seven-order horizon into
    perception and execution ladders, preserving dependency/preference distinctions.
    Candidate paired waves are WO-021/WO-029 and, after WO-009, WO-022/WO-010;
    WO-011 follows its required verification transport/evidence. The operator's
    proposed roles are Codex implementation, fresh Opus 5 verification, and fresh
    Fable final review per order. No models are launched or globally reassigned.
    Current one-order control semantics, overlapping integration surfaces,
    serialized release targets, shared provider capacity, and review reserves
    remain visible. Product 03/06, the human map, and the playbook carry the
    clarification and a prerequisite synthetic closeout experiment. Feasibility,
    productivity, extra usable capacity, and attention benefit remain unproven.

## WO-020 resource environment — 2026-09-04

Source: operator environmental-effect ideation, preserved in local-only
`docs/intake/notes/WO-020-resource-environment-2026-09-04.md` (SHA-256
`0dbd04032d7a7d23ead6421c3bf04ecac5f9c7b77a15912021d483793772f63d`).
Clean Room and Shape-First Synthesis carry the relationship between surrounding
conditions and an activity's initiation/persistence; no source-domain physics
becomes an architectural requirement.

- **Budget pressure can make routine activity harder to initiate and sustain** `preserved`
  - Product 03 preserves a candidate environmental modifier over scoped
    consumption, reservations, and replenishment. It separates base resource
    cost, an effective admission modifier or threshold, and remaining capacity.
    Start and continued/repeated activation have explicit decision boundaries;
    essential work uses the reserve selected by the profile. Product 02 links
    the idea to ResourceModel and mechanism-activation AttentionPolicy without
    claiming dynamic metering or ambient execution. Product 06 separates a
    scheduling response from an actual efficiency improvement. Curves, units,
    thresholds, observation policy, reset/hysteresis, starvation handling, and
    a consuming work order remain open. No schema, primitive, authority change,
    cost measurement, or implementation result is inferred from the analogy.

## WO-020 automation direction — 2026-09-04

Source: a new operator ideation message plus two brief wording corrections,
preserved separately in local-only
`docs/intake/notes/WO-020-automation-direction-2026-09-04.md` (SHA-256
`6b605ca1166e5837bfa194150ba2f33f97dd6bc06b6a51e4968683fe71ae8642`).
Clean Room and Shape-First Synthesis carry only the operator's general automation
preference into this personal implementation. No employer implementation,
configuration, identifier, or internal-service detail is a source. The wording
corrections add no separate product decision or direct-filing exception.

- **Progressively remove recurring procedure through executable mechanisms** `adopted`
  - Repeated manual sequences, derived views, and predictable handoffs are
    opportunities for bounded automation. Use existing commands first, then
    move the smallest useful increment into deterministic code where inputs
    determine the answer. Preserve a clear judgment step and test the effects
    and failures. Product 03's agentic core and 07's execution discipline now
    state this direction. It reinforces the existing composition and authority
    model, with no new primitive, mandatory phase, or blanket scope grant.

## WO-020 Beacon synthesis — 2026-09-04

Source: the distinct operator analogy in local-only
`2026-09-02-beacon-ideation-operator.md`, synthesized under Clean Room and
Shape-First Synthesis. The already filed WO-020/WO-021 public drafts retain
their direct-filing provenance; their sibling planning captures are preservation
records, not material mined for this synthesis. See WO-020's stage-1 receipt.

- **Exact metadata as a cheap observation channel** `adopted`
  - Beacon size discloses a published finite codeword; mtime discloses its
    derivation time. The host fold remains evidence-derived and rebuildable.
    Separate claims expose what an emitter says without turning it into truth.
    Product 02/03/04/09 pin the domain, sparse view, and M0 disclosure boundary.
- **Composition inferred from an emitted signal** `transformed`
  - Carry exact decoding, cheap observation, provenance, and visible age from
    the analogy; discard source-domain objects and physical mechanisms. v1
    uses one file per episode/emitter and a bounded codebook, not an ontology
    of the analogy or a claim that class order is event chronology.
- **Composite observation and alternative physical channels** `preserved`
  - WO-021 is the nominated next slice for control-plane dogfood, authorized
    sweep events, staleness, and group codes. Sparse logical size, symlink
    targets, names, and xattrs remain measured alternatives; only dense file
    size is selected here. Usefulness still requires the separate proposed
    operator comparison, not just the technical acceptance tests.

## WO-020 ideation — current docs, Protíno paths, beacon value, and a readable sequence (2026-09-04)

Source: the operator's four-part `ideation:` message during WO-020 orientation,
captured verbatim as
`docs/intake/notes/WO-020-doc-freshness-protino-beacon-payoff-navigation-2026-09-04.md`
(SHA-256 `114e9d9827a9511078239d911d5340f97e421360a7b1a723eee2203221f71cb3`).
The work-order breakout receipt records capture reconciliation, backup, and
evidence. Clean Room uses Shape-First Synthesis: the new public prose is
rewritten from operator intent; this batch invokes no Direct Draft Fidelity
exception. The screen found no employer material, credential, private
identifier, or internal-service detail.

- **The change that makes a fact different owns its documentation update** `adopted`
  - Clarify the existing same-pass duty: the implementation executor updates
    affected product facts and reader entry points, the independent verifier
    checks them against behavior, and final review closes the consistency
    pass. A separate publication order can assemble an edition or repair broad
    editorial debt; ordinary factual updates do not wait for it. Current
    heading/source-lock checks are useful but do not prove semantic freshness
    across the whole corpus. No new lifecycle phase or universal claim engine
    is selected.
- **Protíno's current documentation uses the `protino` spelling** `adopted`
  - Supersede only the working-path retention choice in the earlier entry
    “The application name uses the Modern Greek verb `προτείνω (protíno)`.”
    The display name remains `protíno`; ASCII `protino` is accepted. Current
    content moves to `11-protino.md` with mutable inbound links updated. The
    previous path keeps section pointers so frozen citations still resolve;
    it no longer holds an independent current document. No package, domain,
    account, or published historical artifact is renamed.
- **Technical feasibility, operator usefulness, and interest need different evidence** `preserved`
  - WO-020 can prove the local Beacon mechanism; WO-021 can expose it in the
    real control-plane workflow. Neither establishes the whole DotLn or
    Protíno thesis. Preserve a bounded post-WO-021 comparison with existing
    status views over normal, refused, stale, absent, and conflicting-claim
    cases, with an operator response and a retain/simplify/defer recommendation.
    This is a proposed learning checkpoint, not an added release gate or a
    claimed trial. The wider work loop and playable application need their
    own evidence.
- **The work-order README should replace the operator's editor checklist** `transformed`
  - Render the operator's ordered seven-item horizon before detailed evidence:
    WO-020, WO-021, WO-029, WO-009, WO-022, WO-010, WO-011. Its single editable
    source is a marked block in the existing human map; the generator supplies
    control-derived progress, short labels, reference links, and one-column
    per-order details. Check marks mean passing final review, with merge and
    release separately evidenced. Preserve explicit recommendation versus
    conservative dependency-reference observation; do not infer ordering from
    IDs or promote every prose reference to a hard dependency. This supersedes
    the wide-table presentation, not WO-026's evidence or stable-address
    contracts. Executable changes and tests remain independent-review subject.

## WO-026 implementation — evidence index and stable addresses (2026-09-04)

Source: WO-026, the map at activation base `68b1ab2`, the canonical control log,
local annotated releases, and the operator's in-session selection of a
recorded-tag snapshot after the release-retry conflict was identified.

- **Work-order files are stable addresses; open and closed are views** `adopted`
  - Implement the 2026-09-02 navigation nomination with a generated README
    over header observations, one shared event fold, and local release-manifest
    attribution. Keep historical orders time-indexed and no-release inference
    separate from later release inclusion. Existing authority paths do not move;
    this order's own target and authorized scope receipts are the bounded edit
    exception. Standardized metadata and scheduling remain unselected.
- **The pilot map's hand-maintained evidence columns** `superseded`
  - Replace those columns with the index; retain human recommendation, tracks,
    rationale, and preflight. The dated activation comparison preserves every
    discrepancy, including stale closure claims and reverse/independent
    references that a literal dependency-token view cannot interpret.
- **Explicit local tag observations make generated evidence reproducible** `adopted`
  - `index` refreshes local tags; `index --check` requires the recorded tag
    objects and current header/control projection. Additional tags are reported
    as newer evidence until refresh. This operator-selected amendment prevents
    a new tag from making its reviewed source fail its own repeat evidence gate.
    It adds no fetch or lifecycle mutation and does not equate local tag time
    with proven remote publication time.

## WO-026 ideation — an end-user workstream application (2026-09-04)

Source: the operator's in-session ideation, preserved unedited in main's ignored
`docs/intake/notes/WO-026-end-user-workflows-2026-09-04.md`. Ordinary Shape-First
Synthesis; private application/deployment naming remains in the local lane.
Public examples are newly authored synthetic scenarios. The operator authorized
the full pipeline and return to WO-026, stopping at readiness for verification.

- **Design the day at the desk before choosing more machinery** `adopted`
  - Add the candidate journey in `docs/product/12-workstream-application.md`:
    arrive, start an outcome, establish scope, receive a receipt, steer, review,
    authorize delivery, and return after interruption. Existing terminal/console,
    sparse context, source-revision, and instance-policy contracts supply its
    foundations. Application identity, deployment topology, and first pilot stay
    open; the documentation does not implement the candidate.
- **Retain successful behavior while replacing its coordination burden** `adopted`
  - Use separate synthetic parity baselines for both existing workflow
    generations to preserve useful intake, scoping,
    standards, evidence, and recovery. Adopt one evidenced slice at a time and
    measure restatement, handoffs, interruptions, and return-to-work cost.
    Neither predecessor implementation material nor a bigger inherited prompt
    becomes the specification. Thresholds and a representative pilot remain
    `preserved` choices rather than invented acceptance results.
- **One outcome can coordinate separate repository changes** `adopted`
  - A durable workstream relates bounded work orders and evidence across
    repositories. Keep local histories, bases, writers, reviews, and delivery
    states separate, and tie shared acceptance to named revisions. Preserve
    partial delivery and conflict visibility; do not imply an atomic merge,
    universal rollback, or that every green local check proves the outcome.
    Shared-repository contention and changed dependencies become explicit
    coordination scenarios for a later bounded implementation.

## WO-028 implementation — control append time and labeled recovery (2026-09-04)

Source: WO-028's control-time authority, its activation log, and executable
fixture evidence in `docs/discovery/control-event-time-evidence-2026-09-04/`.
The implementation consumes the consolidated control parser and Git runner;
no intake source or employer-derived material entered this change.

- **Control append time is recorded evidence, not lifecycle authority** `adopted`
  - Every new transition records canonical millisecond UTC `recordedAt` under
    optional schema-v1 compatibility. Invalid present values refuse; valid
    absence, field order, and backwards times cannot change phase, legal
    actions, or recovery advertisement. A separate projection reports the
    latest completed attempt of each phase with signed milliseconds or
    unknown endpoints; it neither sums attempts nor treats waiting as effort.
- **Historical time recovery preserves its source and precision** `adopted` `recovered`
  - The read-only `times` command and dated observation distinguish recorded
    append time, local-checkpoint committer time, and unknown. At activation,
    120 of 135 events had recoverable times from 120 named refs; the remaining
    15 stayed unknown. The 122 local checkpoint refs were byte-identical before
    and after the implementation evidence run. Recovery never edits the log,
    substitutes into phase timing, or pushes checkpoint objects. The public
    timing choice is explicit; token, cost, attention, and other private-lane
    telemetry remain outside this work.

## WO-028 expanded ideation — cumulative context, success under growth, and Entropy Reducer use (2026-09-04)

Source: the operator's three ideation subjects and preceding model/release
steering, captured unedited in main's local-only
`docs/intake/notes/WO-028-expanded-ideation-2026-09-04.md`. The canonical file
matches its validated owner-only backup `DotLn-intake-20260904T195218Z.zip`;
the provisional worktree copy was removed after byte comparison. Ordinary
Shape-First Synthesis rewrites the meaning for public docs. No employer code,
configuration, identifier, service detail, credential, private identifier, or
other clean-room stop condition was found. The operator explicitly authorized
returning to WO-028 after the complete pipeline and stopping at readiness for
independent verification.

- **The cumulative-song analogy concerns inherited startup cost** `transformed`
  - This supersedes the earlier **12-Days-of-Christmas restart framing** entry's
    replacement-performer/current-score interpretation, which remains unchanged
    as history. Each later verse already contains earlier material; a fresh
    session admitted with a large inherited context starts with the burden of a
    later verse before doing new work. The public README, Principle 4, and
    inspirations register now preserve that relation. Source retention and
    task-context admission remain different budgets; no lyrics are needed in
    the public synthesis.
- **A successful decision can create its own later failure mode** `preserved`
  - A candidate review asks how the property producing today's benefit scales
    into tomorrow's burden, which scenario and observation would reveal the
    crossover, and whether to prevent, experiment, watch, or accept it. This is
    distinct from the six-month with/without livability comparison and works
    beside Theory of Constraints and Beware of Naive Interventionism. Growing
    evidence/context, event-fold cost, workflow handoffs, and change fan-out are
    hypotheses, not an indictment of current architecture or a license to
    reopen settled tradeoffs. Keep the review inside the existing decision
    rather than adding compulsory ceremony to every edit.
- **Routine observation need not imply an optimization campaign** `preserved`
  - A candidate bounded system baseline can show size, processing latency,
    context admission, workflow flow, and dependency fan-out over comparable
    conditions while no intervention is underway. Its source, missingness,
    outcome denominator, collection cost, retention, and privacy boundary must
    be explicit. Daily is a possible cadence, not a newly installed scheduler.
    Use neutral system language publicly; the operator's personal routine is
    the source shape, not a body judgment. Feed selected trends or exceptions
    to models, never another unbounded raw stream that recreates the problem.
- **The shipped Entropy Reducer needs an honest operator entry point** `adopted`
  - `docs/instance/entropy-reducer/README.md` now provides a manual Fable 5.1/max
    dispatch, frozen-subject requirements, existing compile/validation APIs,
    fresh blinded refutation, and the stop at operator disposition. It neither
    launches a review here nor invents a resume command, transport, scheduler,
    or self-promotion authority. Its generated residue and immutable first-run
    receipts remain unchanged.
- **Compiled Shape-First still has a literal-first ordering mismatch** `preserved`
  - Inspection of the v0.5.0 support and generated residue found literal
    weaknesses/fixes requested before extracting the useful relation. The new
    guide supplies the operator's explicit shape-first correction at dispatch.
    A bounded follow-on must correct the typed support, regenerate its output,
    and verify the changed contract; no hand edit pretends it has already
    shipped. The corrected song analogy does not depend on performing that
    later implementation now.
- **Routine workflow defaults should not require repeated opt-in** `adopted`
  - The operator selected GPT-6 Astra/max for Codex steps going forward; bounded
    local discovery observed the `max` persisted selector for Codex CLI 0.153.2,
    with no effective-session-readback claim or settings mutation. The operator
    also authorized assigning/updating normal release targets by default,
    opting out explicitly when desired. WO-028 takes the next compatible patch,
    v0.5.1 above v0.5.0. Existing retiming, independent verification, merge, and
    publication authorities remain separate.

## WO-023 expanded ideation — context projections and `προτείνω` naming (2026-09-04)

Source: two operator ideation messages during the active WO-023 implementation,
captured verbatim in the main checkout's local-only
`docs/intake/notes/WO-023-expanded-ideation-2026-09-04-02.md`. Its SHA-256 is
`165d095de7cfc0bf27d83f72c697e06bfad492a281d7cb74462abf24f979bc86`.
The canonical capture is present in the validated owner-only backup
`DotLn-intake-20260904T173830Z.zip` (SHA-256
`20ccea0ae5b7340a4a4b286e25f765be09ad902b75569fc6e98ea31a5376542d`);
no `/private/tmp` staging copy remains. The clean-room screen found no employer
code, configuration, identifier, internal service, credential, private
identifier, or other stop condition.

- **Task-specific LLM context is a lossy projection with an explicit receipt,
  not another semantic view** `transformed`
  - Existing WorkOrders, selective blueprint citations, prompt fragments,
    sparse agent projections, publication source references, and model-input
    plans already carry most of the doctrine. The missing executable boundary
    is a neutral pure `ContextProjectionPlan`: given explicit source bytes,
    section references, compiled role/loadout/authority, runtime profile, and
    budget, return required, selected, and omitted references, exact costs,
    source/transform versions, capability losses, and visible expansion
    handles. The host performs reads and records the sent bytes. This projection
    must not join the compiler's lossless editable-view union or claim semantic
    equivalence to the full source.
- **A table of contents is the first selector index, not the whole context
  boundary** `transformed`
  - Today, reading only the WorkOrder's cited sections is sufficient and avoids
    duplicate summaries. A future selector starts required-first and refuses
    when the objective, acceptance criteria, applicable settled decisions,
    constraints, non-goals, authority, required evidence, and output contract
    cannot fit. It does not silently truncate, infer relevance with an
    undeclared model, or disguise a tokenizer as a pure function. Stable blocks
    may be materialized and task-specific context expanded on demand; JIT/AOT
    remains compatibility and migration vocabulary.
- **Do not file a context-projection work order before its first consumer**
  `preserved`
  - WO-009's real WorkOrderTransport is the earliest plausible consumer. A
    separate order or bounded follow-on becomes warranted only when an actual
    transport supplies exact serialization, tokenizer/context-limit, omission,
    and outcome evidence and demonstrates selective-reading failure or cost.
    A universal context optimizer now would be naive interventionism: it would
    optimize a proxy without a runtime call, duplicate truth, and risk silently
    widening privacy or authority.
- **The application name uses the Modern Greek verb `προτείνω (protíno)`**
  `adopted`
  - The product name uses the first-person singular verb form “I suggest” or “I
    propose,” which serves as the dictionary headword for “to suggest” or “to
    propose”; the related noun `πρόταση` means a suggestion or proposal and is
    not the product name. The displayed pronunciation guide is now `protíno`.
    The existing `11-proteino.md` path remains a historical
    documentation path so prior evidence links do not move; it is neither the
    canonical Latin display form nor a settled technical slug.

## WO-023 implementation — first compiled Entropy Reducer episode (2026-09-04)

Source: review episode `ep_entropy_reducer_20260904_001` and fresh blinded
refutation episode `ep_entropy_refutation_20260904_001`, preserved under
`docs/instance/entropy-reducer/runs/`. Both attest Claude Code 2.1.260,
`claude-fable-5-1`, and `max`; the harness-reported tiny internal Haiku helper
usage is disclosed rather than treated as a substitution. Source and scratch
Git status were byte-identical before and after each episode. The review created
only 75 ignored `packages/*/dist` files in scratch; refutation created none.

- **Entropy Reducer is now a compiled loadout with a live review receipt**
  `adopted`
  - Its first run used the compiled WorkOrder, authority, one-shot cadence,
    four bounded lenses, output validator, and generated residue against a
    frozen WO-023 subject. The reviewer produced seven findings and one proposal
    payload. A fresh Contra-Auguste episode saw only each finding ID and its
    reproduction command or inspection steps; all seven survived. The
    implementation repaired every survived finding before requesting ordinary
    independent lifecycle verification.
- **The readable reviewer brief is a generated projection, not a second source
  of truth** `adopted`
  - Identity dispositions and invariants, role obligations, active semantics
    and constraints, masks, and every linked support now participate in residue
    generation. Mutation and byte-regeneration tests refuse hand-edited drift.
    The dispatch host—not the authority-envelope prose—owns filesystem-root
    confinement.
- **Sustain remains a candidate cadence** `preserved`
  - This episode establishes an explicitly dispatched one-shot review. It does
    not establish that recurrence improves outcomes, so Shitsuke/Sustain is not
    equipped until observed cadence evidence justifies it.
- **Review output did not manufacture implementation authority** `adopted`
  - The proposal payload remains only in the receipt and was not filed. WO-029
    was drafted through the operator's separately authorized ideation breakout,
    a recorded direct-to-work-order bootstrap exception rather than reviewer
    self-promotion.

## WO-023 activation — v0.5.0 forward retiming (2026-09-04)

Source: the operator's `resume: next` dispatch activated WO-023 on published
`v0.4.1` with `v0.5.0` pinned in the active work-order authority. The earlier
planning pass had already recorded this activation as the reversal condition
for retiming the unpublished WO-009-and-later ladder.

- **WO-023 owns application release `v0.5.0`; later unpublished targets return
  to activation-time assignment** `adopted`
  - The roadmap now carries the dated migration note and a WO-023 rung. Former
    `v0.5.0` through `v0.10.0` targets are retained as superseded planning
    history, while WO-009, WO-010, WO-011, projections, pattern workshop, and
    the source-to-deliverable vertical are unassigned until each explicit
    activation. The accepted kernel-first build order and every published tag
    remain unchanged; no arithmetic version shift is inferred.
  - WO-029's filing assigns no release and no queue position. Its recommendation
    is immediately before WO-009 so that worker can consume the receipt if the
    operator still chooses the order then.

## WO-023 implementation — claim-free prefix wildcard lowering (2026-09-04)

Source: the active WO-023 definition requires bounded effect families such as
`repo.read*` and `repo.write*`, while the landed compiler typed those patterns
but rejected every one. The kernel already evaluates a terminal `*` as an
anchored prefix and checks denies before allows. Retargeting WO-023 to the real
compiler therefore exposed a contract gap rather than authorizing a universal
grant.

- **Direct terminal prefix globs compile only without participating authority
  claims** `adopted`
  - This entry extends **Precedence resolves claims; only pipelines order
    transforms**. Exact patterns keep their existing behavior. A direct
    wildcard in an active WorkOrder, active AuthorityEnvelope, or linked
    permission emission may lower only when no linked `authority.*` claim
    participates. Participating wildcard claim targets still reject, and adding
    any participating authority claim to a graph containing a direct wildcard
    rejects the whole graph; unequipped catalog definitions remain inert. The
    bounded case needs no precedence exception; the mixed case remains
    unsupported rather than guessing.
  - Compiler fixtures cover active and support-origin grants and denials, the
    inert unequipped case, wildcard-claim refusal, mixed exact-claim refusal,
    and the compiler and Entropy Reducer fixtures cover anchored family matching
    plus deny-before-allow behavior in the kernel.
    This is a compatible compiler capability used by the Entropy Reducer, not
    an owner-sovereign mode or a claim that `*` by itself is a safe profile.

## WO-023 ideation breakout — pinned artifact identity (2026-09-04)

Source: the operator's ideation message during the active WO-023 implementation
episode, including an ad hoc Fable planning report, captured verbatim in the
main checkout's local-only
`docs/intake/notes/WO-023-expanded-ideation-2026-09-04.md` and rewritten through
Shape-First Synthesis. The canonical capture is byte-verified in an owner-only
backup; no worktree-local duplicate remains. The clean-room screen found no
employer code, configuration, identifier, internal service, credential, private
identifier, or other stop condition. The operator explicitly expanded WO-023
to file WO-029 during this implementation session and authorized returning to
the active implementation afterward.

- **Pin compiled identity at equip and compare it when behavior consumes the
  program** `adopted`
  - The compiler already emits a semantic equality key and a component manifest,
    while the skeleton logs only the graph and discards the key. WO-029 is the
    bounded missing execution-receipt slice: record compiler contract and
    package versions plus compiled identity in the equip event, hold them with
    authority, and turn a later disagreement or compile diagnostic into a
    durable, inert refusal.
    The new equip payload is explicitly v2. Legacy payloads replay only on the
    historical side of a logged, idempotent enforcement boundary; after that
    boundary they must re-equip with a valid pin before originating new
    program-consuming decisions. This preserves compatibility without creating
    an unpinned forward-execution bypass.
    This is useful before the first external worker and closes adopted receipt
    doctrine. It is not necessary to make today's trusted in-process graph run,
    and no loadout-drift incident is claimed.
- **Semantic identity and component-definition identity answer different
  questions** `transformed`
  - The operator's “unique value” shape becomes two explicitly non-cryptographic
    equality records. The existing `semanticHash` remains a key for normalized
    compiled behavior. Separate domain-labeled definition hashes identify the
    active, linked, and ambient definitions named by the participation manifest
    without entering the semantic-hash preimage. This preserves the settled
    meaning of semantic equality while making a same-id/version definition edit
    attributable. WO-101's independent FNV path supplies a distinct oracle; it
    is evidence, not a permanent veto on future hash design.
- **A universal core verifier, per-pulse membership checks, and signatures wait
  for a real trust boundary** `preserved`
  - Supports do not execute or submit identities today, and a reused schedule id
    cannot reveal which equip issued it without stamping the event. Per-effect
    or per-pulse submission and Merkle membership therefore wait for a concrete
    submitter. Signing waits for a non-author graph, external principal, or
    distribution boundary with an actual key owner and rotation problem. Until
    then, adding keys would verify one principal's value with the same
    principal's machinery and export cost without increasing assurance.
- **Pinned artifact identity is personal-profile doctrine over an optional
  platform mechanism** `adopted`
  - ADR-0006 rules out making the check an unavoidable law of every DotLn loop.
    The author's profile may fail closed on drift; another implementation may
    omit the receipt and expose that absence honestly. WO-029 is filed with a
    recommendation to run immediately before WO-009, after WO-023 supplies its
    second fixture; filing does not prioritize it. The first out-of-process
    worker is the natural whole-program-pin consumer. Its expected minor
    classification and exact version remain activation-time decisions.

## WO-018 ideation breakout — additional opinions and adjudication (2026-09-04)

Source: the operator's `ideation:` message during WO-018, captured verbatim in
local-only `docs/intake/notes/WO-018-expanded-ideation-2026-09-04.md`, then
rewritten through Shape-First Synthesis. The capture was byte-verified in the
main checkout's canonical intake and placed in a validated owner-only backup;
the worktree staging duplicate was removed only afterward. The clean-room
screen found no employer code, configuration, identifier, internal service,
credential, private identifier, or other stop condition. The operator
preauthorized resuming only the active `resume: next` implementation step after
this breakout.

- **Second Opinion is the bounded preset; Additional Opinion is the general
  candidate support** `transformed`
  - The small form permits exactly one extra episode, for two results total.
    The generalized form permits a finite cohort bounded by count,
    concurrency, deadline, cost, and a marginal-value stop rule. These are
    width bounds; recursive opinions on opinions remain prohibited in the
    recommended first slice. Neither behavior exists in resume control v1.
- **Repeat the immutable subject, not the lifecycle transition** `transformed`
  - An eligible episode-producing stage can keep “another opinion” available
    while a cohort is open. Every run receives new command, episode, result,
    and actor-attestation identities over the same pinned WorkOrder content
    hash/revision, base, criteria/input evidence, loadout, and environment
    contract. Verification pins one exact candidate; implementation variants
    instead record a distinct produced artifact on each result. The event log
    advances. Activation, authority, destructive effects, completion,
    publication, release close, and adjudication are not generic self-loops.
- **A sealed adjudication is a lossless, one-way barrier with a proposed uniform
  two-exit rule** `preserved`
  - Validation, hard gates, normalization, provenance-preserving duplicate
    clusters, agreement/conflict relations, optional synthesis, and a separate
    adjudicator form an ordered pipeline. Sealing fixes the admitted result set;
    late results retain a disposition but cannot reopen it. The operator proposed
    that every adjudication route only to fix or final review. Volume never
    overrules a supported blocking finding.
- **The first slice applies the two-exit rule to verification; implementation
  routing remains transformed and deferred** `transformed`
  - A verification adjudication routes only to fix or final review, including an
    unresolved outcome through fix. A raw implementation candidate cannot route
    to final review without violating the settled independent-verification gate;
    it must first select an artifact for verification or go to fix. The uniform
    rule remains preserved as a proposal, while implementation plurality waits
    for an explicit resolution rather than silently weakening assurance.
- **Implementation variants and verification opinions need different
  isolation** `transformed`
  - Every mutating candidate gets a sibling branch/worktree from one frozen
    base, with one writer per worktree and a separate single-writer integration
    branch. Selecting a whole candidate is the smallest first mechanism;
    combining patches creates a new subject and requires fresh evidence.
    Verification opinions inspect the same immutable candidate in fresh,
    preferably blinded contexts; a later actor that sees an earlier result is a
    critique, not an independent opinion. One host serializes canonical events.
- **Opinion cohorts can produce Eye Dr evidence, not automatic model
  rankings** `preserved`
  - Same-model repeats measure variance; diverse panels measure a different
    relation. Pairwise preferences happen only after hard constraints pass and
    record model/checkpoint, effort, harness/version, workflow mode, input and
    loadout revision, visibility, order, task class, time/cost, unique accepted
    findings, downstream rework, and operator judgment where observable.
    Acceptance rate alone rewards leniency, correlated runs are not independent,
    and ratings remain replaceable projections.

## WO-018 implementation — control-plane consolidation (2026-09-04)

Source: the active WO-018 implementation on the published `v0.4.0` base. This
entry records the work order's explicit manifest non-goal without duplicating
the 2026-09-02 adopted decision that control state is data and a disposable
projection is never an API.

- **A `program` compatibility field in the release manifest remains a
  candidate** `preserved`
  - Cadence compatibility can now be derived from bounded built-kernel exports,
    but a flat `program` field would overstate what the current runtime proves
    about recursive Program evaluability and continuation behavior. Add no such
    field merely by analogy. Reverse this deferral when the kernel exposes a
    reviewed Program compatibility contract or a concrete release consumer
    needs one, then require built-export derivation and a publication-blocking
    negative fixture before adoption.

## 2026-09-04 gardening planning pass (operator-dispatched, after the `v0.4.0` close)

Source: the operator's 2026-09-04 dispatch for a quick planning and
repo-gardening session run as the entropy reducer with Beware of Naive
Interventionism equipped, preserved locally as a compaction-safety capture in
`docs/intake/notes/2026-09-04-gardening-planning-dispatch.md`. The session was
asked to declare Effort where drafts still lacked it, assess the product docs and
ledger for missing, stale, or misordered work orders, and watch for refactoring
and organization needs. It filed no new work order. Identifiers are opaque
stable references; a recommendation records a finding and a bounded route, not
activation authority. The clean-room screen found no employer, credential,
internal-service, or other stop condition.

- **Every remaining draft declares Effort before activation, at one uniform
  floor** `adopted`
  - WO-009, WO-010, WO-011, WO-014, WO-102, WO-103, WO-105, WO-107, and WO-108
    gained `executor xhigh+; verifier xhigh+; reviewer any` directly after their
    Model field; no other wording changed. The floor matches every declaration
    written or accepted since WO-016. On this machine it changes nothing
    practical for the Codex-targeted corpus track: discovery records only a
    persisted `xhigh` selector for Codex CLI 0.153.0, so a Codex actor can
    attest `xhigh` or `unknown` and nothing between, while `any` would have
    admitted `unknown`. WO-109's `high+` carve-out for mechanical side routines
    remains the model for an exception, granted per order through the dated
    amendment path rather than by a lower default; WO-107 is the order most
    likely to want it, since the roadmap intends profiling orders to be
    executable by a low-cost model.
- **WO-023's pull-forward trigger fired; it now follows WO-018 directly**
  `adopted`
  - The 2026-09-03 pass recorded the condition (a fourth manual review or
    planning session before WO-021 closes); this session is that fourth. WO-008's
    close also discharged the other waiting reason, since the reviewer now
    compiles against the real `@dotln/compiler` instead of a second
    hand-assembled loadout. The map's recommended sequence is WO-018 → WO-023 →
    WO-028 → WO-026 → WO-020 → WO-021 → WO-009 → WO-022 → WO-010 → WO-011.
    Activation must retarget WO-023's compile step from its pre-WO-008
    `compile*` fallback to the landed compiler, and whichever minor lands first
    takes `v0.5.0`, which makes the pinned WO-009 through WO-011 targets subject
    to the roadmap's dated retiming note; that consequence already followed from
    the previous sequence.
- **The tree at `v0.4.0` is healthy, and WO-018 remains the only refactor due**
  `adopted`
  - `npm test` is green at `9293d50` (154 node tests plus every shell suite) and
    leaves tracked files unchanged; there are no stray worktrees or branches,
    and the 109 local checkpoint refs remain the only record of historical
    transition times until WO-028. The duplicated script helpers WO-018
    enumerated are still present in the same counts, so its observed-problem
    list is current. The kernel's `stableHash` and the compiler's `fnv1a64` are
    one FNV-1a 64 algorithm implemented twice because the compiler deliberately
    depends on nothing; both are pinned by tests (the WO-101 vectors and the
    compiler hash suite), so the duplication is watched rather than a defect.
    The main checkout's `.claude/settings.local.json` is ignored by a
    machine-local Git exclude rather than the repository's `.gitignore`, which
    is exactly the gap WO-018's scope clarification closes.
- **Declined candidates, each with its reversal condition** `preserved`
  - Filing the claim-layer authority floor (WO-008 VER-001 F2) as a work order:
    NoOp. FINAL-001 nominated it for the rung at which graphs stop being
    author-trusted; WO-022 and WO-023 compile author-trusted graphs. Reverse at
    the first saved build or non-author graph.
  - Filing the audit link-first fold: NoOp. The demo log carries canonical links
    since WO-016, but no shipped projection groups wrongly today. Reverse at
    WO-020 activation preflight if beacon groupings need it, or on a fixture
    showing a wrong adjacency grouping.
  - Filing the canonical private intake reconciliation helper: NoOp. Three
    closes have met the manual reconciliation step, but the private-store
    choices are open and the helper would want WO-018's `scripts/lib/`. Reverse
    after WO-018 lands or at the next close refused for worktree intake.
  - Marking `@dotln/kernel` `private: true` in this pass: NoOp. The ledger's
    2026-09-03 gap is still open, but a manifest change with a
    publication-refusal test is implementation that needs verification. Reverse
    by naming it as a bounded boy-scout item in the next order that edits
    package manifests, or in the licensing gate.
  - Cleaning the stale "reserved `v0.2.2`/`v0.2.3`" sentences in the corpus
    drafts and runbook: NoOp. They are harmless history and the activation-time
    H1 rewrite touches the same paragraph. Reverse at each activation.
  - Promoting the capability table's compiler row from staged to verified
    `1 — demonstrable`: NoOp. The reviewer left it staged; the end-of-order
    check owns promotion. Reverse at WO-026 or the next capability-table pass.
  - Retiming the pinned WO-009 through WO-011 versions now: NoOp. It requires
    explicit operator authorization and a dated migration note. Reverse when
    WO-023 or WO-020 activates as `v0.5.0`.

## WO-008 implementation — composition compiler v1 (2026-09-03)

Source: the active WO-008 implementation episode on the published `v0.3.6`
base, staged for application release `v0.4.0`. These entries lower previously
adopted composition ideas into the bounded Seiri compiler subject awaiting
independent verification and final review; they do not predeclare either
verdict.

- **LoadoutGraph v1 is now a pinned graph contract** `adopted`
  - The first executable schema carries versioned identity, role, containers,
    active mechanics, support definitions, links, link groups, explicit
    pipelines, ambient declarations, a resource model, and PolarAxis inputs.
    Definitions form a catalog; a support participates only through a link.
    Compiler v1 deliberately lowers one active mechanic while the broader type
    surface remains available without pretending its deferred semantics run.
- **Inactive supports return repairs, not hope** `adopted`
  - Link checking resolves references, tag compatibility, and explicit
    environment capabilities before lowering. A missing capability produces a
    structured `SUPPORT INACTIVE` diagnosis naming the active, support, group,
    exact missing capability, and concrete provide-or-unequip corrections. No
    requested support is silently discarded.
- **Precedence resolves claims; only pipelines order transforms** `adopted`
  - Conflicting soft claims emit the effective winner and record every
    overridden claim through the declared nine levels; authority-target winners
    also govern the runtime envelope and WorkOrder operation lists. Wildcard
    authority patterns reject at this compiler rung rather than masking an
    exact winner. Two incompatible hard claims reject.
    Ordinary support order is normalized away; a non-commuting pair rejects
    unless a separate `ExplicitPipeline` names its order, which governs
    transforms and whose sequence normalization preserves exactly. Compiler v1
    rejects multiple participating link groups instead of inventing a
    cross-group order.
- **Semantic equality is canonical compiled-program equality** `adopted`
  - Code DSL, function-table, and statechart-JSON codecs reconstruct one graph
    and satisfy `decode(encode(x)) = normalize(x)`. The semantic key is the
    `fnv1a64:` digest of the UTF-8 canonical JSON for the entire normalized
    compiled program. It is explicitly non-cryptographic and excludes
    source-view formatting while including executable semantics and declared
    costs. Finite JSON numbers are required and negative zero normalizes to
    zero, closing the JSON encode/decode edge.
- **Seiri's five links now compile to heterogeneous mechanisms** `adopted`
  - Bounded scope becomes WorkOrder structure, read-only behavior becomes a
    permission guard, evidence capture becomes a schema, absent-only behavior
    becomes cadence plus statechart guard, and independent checking becomes a
    verifier episode. Each support reports mechanism, prompt tokens, runtime
    units, and extra episodes. The skeleton consumes those compiled values and
    retains the complete historical 21-decision trace sequence.
- **The item tooltip is an executable diff projection** `adopted`
  - The default presentation keeps `Seiri / Sort / 整理` primary and renders
    GRANTS, RESTRICTIONS, OBLIGATION, PASSIVE, PULSE, INTERRUPT, true support
    cost, and before/after semantic hashes. Equipping and unequipping compare two
    compiled programs; the tooltip is not a separately authored card.

## WO-016 ideation breakout — interim licensing and legal gates (2026-09-03)

Source: the operator's latest `ideation:` addition in the continuing WO-016
batch, captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. The committed
synthesis records the personal, noncommercial present without assuming that
revenue is the first legal trigger. Repository inspection and authoritative
public guidance informed the status note. No employer material, credential,
private identifier, protected configuration, or other clean-room stop condition
was present.

- **Source-visible is not automatically open source** `adopted`
  - The repository currently contains no project license. Default copyright
    rules therefore apply to original expression, while GitHub's terms grant
    viewing and reproduction through GitHub functionality, including in-service
    forking. The README and legal posture say this explicitly rather than
    allowing a public repository to imply a permission the operator never
    selected.
- **Personal research may keep an explicit no-license posture for now**
  `adopted`
  - No MIT, Apache, source-available, documentation, data, or asset license is
    silently chosen during ideation. The operative state remains personal
    research by and for the operator, with an explicit decision required before
    the first external contribution or distributed/hosted consumer surface.
- **Contribution and distribution trigger review before sale does** `adopted`
  - Outside code, package/binary/container/data or asset distribution,
    multi-user hosting, collection of another person's data, material brand
    investment, and commercial use each force a scoped license/legal decision.
    The gate may need inbound contribution terms, third-party notices, privacy
    and retention terms, provider disclosure, and name clearance even if the
    project is never sold.
- **Unpublished packages need an executable publication brake** `preserved`
  - Root and skeleton packages are private, but `@dotln/kernel` currently lacks
    `private: true`, and no workspace records `UNLICENSED`. A bounded follow-on
    should correct every package manifest and test the no-publication posture;
    WO-016 does not mix that metadata change into its reactor subject.

## WO-016 ideation breakout — intellectual inheritance is a public surface (2026-09-03)

Source: the operator's request in the continuing WO-016 batch for an explicit,
candid list of everything that has shaped the repository, captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. Ordinary Shape-First
Synthesis preserves the intellectual-humility and translation-cost shapes
without promoting the raw wording as public copy. The screen found no employer
code, configuration, identifier, internal service, credential, private
identifier, or other stop condition.

- **DotLn makes no novelty claim about its ingredients or mixture** `adopted`
  - The project is openly a synthesis of books, methods, research, stories,
    games, tools, conversations, personal practice, failures, and ambient
    culture. Its work is translating recognizable source concepts into native,
    inspectable mechanisms; composing and implementing them; and learning what
    survives use. Attribution should make that work easier, not force familiar
    ideas through novelty theater.
- **“Full” means best-known and living, not omniscient** `adopted`
  - A public register includes every influence presently remembered or
    discovered, including sources with no mapped mechanic, uncertain lineage,
    ambient traditions, and forgotten exact citations. `Unknown` is valid. The
    register never claims complete causal archaeology of a person living in the
    twenty-first century.
- **The public inspiration register and private source register are different**
  `adopted`
  - `docs/lineage/inspirations.md` is the canonical discoverable inventory of
    external and lived influences; the vision keeps a curated narrative. The
    future WO-109 register accounts for bounded re-mining of private intake and
    deliberately excludes external works. Neither substitutes for the other.
- **Attribution does not import expression or implementation** `adopted`
  - Exact names identify sources and do not imply affiliation or endorsement.
    Inspiration is distinct from copied text/code/assets, dependencies,
    licenses, third-party notices, and fair-use analysis. The register can say
    what contributed a shape while separately marking review state, exact-
    expression use, and unresolved rights provenance.
- **Internal authorship uncertainty cannot erase known outside sources**
  `adopted`
  - ADR-0001 still declines unsupported forensic apportionment among operator,
    model, and generalized `v1` lessons. Its amendment makes clear that this is
    not permission to omit a known external/cultural source or a license and
    provenance obligation.

## WO-016 ideation correction — local harness settings are not release evidence (2026-09-03)

Source: the operator's request in the continuing WO-016 ideation batch to stop
repeated release-close warnings about `.claude/settings.local.json`, captured
unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. The diagnosis below
uses path metadata and release/worktree behavior only; the local file's contents
were not read or promoted. No employer code, configuration value, identifier,
internal service, credential, private identifier, or other clean-room stop
condition was present.

- **Main-local harness state and disposable-worktree material need different
  decisions** `adopted`
  - The exact root `.claude/settings.local.json` is legitimate persistent
    operator-owned harness state in the main checkout. It is not an input to the
    release scripts or test chain, so its mere ignored presence should not block
    deterministic release evidence. A copy inside the subject worktree is
    different: removing that worktree would destroy it, so cleanup must still
    refuse and preserve the file.
- **One exact exemption, not a `.claude` wildcard** `adopted`
  - The executable correction should add the exact path to the repository ignore
    contract and the main-checkout release-influence allowlist. It must not
    exempt `.claude/**`, classify the file as disposable, copy its contents, or
    weaken refusal for foreign ignored material and `docs/intake/`.
- **WO-018 owns the executable classifier correction** `adopted`
  - WO-018 already consolidates the release and worktree ignored-material
    classifiers. Its dated scope clarification adds the asymmetric case and
    fixtures: main release close succeeds while the exact settings file and
    intake survive; subject-worktree cleanup refuses while its settings copy,
    worktree, and branch survive. WO-016 records the decision but does not mix
    control-plane code into the reactor implementation.
- **Historical warnings remain truthful provenance** `preserved`
  - Prior final reviews correctly predicted the current guard's deterministic
    refusal. They are not rewritten after the policy changes; the durable fix
    belongs in current operating guidance and executable tests.

## WO-016 ideation refinement — unattended work-order portfolios replace prompt crons (2026-09-03)

Source: the operator's live refinement in the continuing WO-016 ideation batch,
captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. Ordinary Shape-First
Synthesis carries the old-supervision/new-workflow contrast without promoting a
named tool or the raw phrasing. No Direct Draft Fidelity exception was
requested. The clean-room screen found no employer code, configuration,
identifier, internal service, credential, private identifier, or other stop
condition.

- **The founding away-time scheduler was partly a prompt-babysitting
  workaround** `transformed`
  - Recurring self-repair, entropy reduction, and review-checking loops were
    originally imagined while one prompt-bound agent needed repeated nudges and
    ad hoc timers. Durable WorkOrders, lifecycle state, and eventual automatic
    processing provide a better unit. Preserve cadence and autonomy shapes, but
    apply them to selection among bounded orders rather than reconstructing a
    forever-running prompt session.
- **Unattended processing starts with small orders already inside standing
  authority** `adopted`
  - When an opted-in processor has no fresh operator ordering, it may begin with
    eligible, low-interruption WorkOrders that introduce no material decision or
    new approval. Housekeeping and small cleanup orders are attractive because
    they can reduce return-time reorientation, not because every maintenance
    action is inherently harmless.
- **Preauthorization creates an optional portfolio, not a promised queue**
  `adopted`
  - Before stepping away, the operator may nominate a bounded set of larger-
    authority WorkOrders as choices. Nomination carries the declared grant and
    conditions; capacity permitting is implicit unless the operator marks an
    order required. Dependencies, base revision, environment, active window,
    budgets, and stopping policy still determine whether any option starts and
    in what order.
- **Silence does not invent a portfolio** `adopted`
  - Lack of a new ordering message becomes a scheduler input only under an
    explicitly selected unattended-processing policy. Authority for a larger
    order comes from its standing regime or preauthorization, not from a model
    interpreting operator silence. PresencePolicy may activate, rank, pause,
    reset, or replenish the portfolio without collapsing selection into
    authority.
- **Return needs one workstream-level reorientation view** `preserved`
  - The handback should distinguish completed, active, skipped, blocked, and
    still-optional orders; surface material changes and decisions; and retain
    why the scheduler chose each activation. Exact concurrent-slot, pause,
    cancellation, preemption, and return semantics remain open.

## WO-016 ideation correction — worktree intake needs canonical reconciliation (2026-09-03)

Source: the operator's intake-lifecycle question in the continuing WO-016
ideation batch, captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. The answer below is
grounded in the current scripts, tests, worktree layout, and the prior WO-007
finding rather than inferred from the pipeline diagram. No employer code,
configuration, identifier, internal service, credential, private identifier, or
other clean-room stop condition was present.

- **The durable synthesis survives Git; a worktree-local raw note does not**
  `adopted`
  - Ledger, product-doc, decision, and receipt changes enter the branch and can
    reach `main`. A raw file captured under a disposable worktree's ignored
    `docs/intake/` remains only in that directory: branches, PRs, checkpoints,
    and ordinary stashes do not carry it. The normal close path refuses to
    delete the worktree, but forced removal or disk loss can still lose the raw
    source.
- **Backup is durability, not canonicalization or semantic reconciliation**
  `adopted`
  - The current backup command archives only the checkout where it runs. It does
    not copy into `main`, merge divergent batches, register the note for later
    re-mining, or update the blueprint. A raw-byte sync solves storage location;
    the ideation pipeline or a later bounded re-mining pass resolves what the
    material means. Neither operation substitutes for the other.
- **One private intake store must be addressable across worktrees** `adopted`
  - The current intended survivor is the main control-plane checkout's ignored
    intake. A future store may live outside every checkout, but callers need one
    resolver and opaque capture identity rather than assuming relative
    `docs/intake` means the same bytes everywhere.
- **Capture/status/reconcile should replace manual drift repair** `preserved`
  - A candidate helper resolves the canonical store, detects identical and
    divergent path collisions, copies atomically without overwrite, verifies a
    trusted owner-only backup, removes staging only after a recoverable copy
    exists, and keeps a private manifest from capture id to synthesis receipt.
    Worktree close should name that operation explicitly. Exact external-store,
    encryption, locking, retention, and recovery choices remain open.
- **The current WO-016 raw batch is staged, not reconciled** `adopted`
  - Direct inspection found the active raw note in this worktree and absent from
    `main`. It remains protected by the closeout refusal and must be backed up
    and reconciled before this worktree is removed; the committed synthesis is
    already the shared-memory path for subsequent work.

## WO-016 ideation correction — presence is not a one-way autonomy brake (2026-09-03)

Source: the operator's further live `ideation:` correction in the WO-016 batch,
captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. Ordinary Shape-First
Synthesis preserves the autonomy-curve and explicit-subgame shapes without
copying the raw passage. No Direct Draft Fidelity exception was requested. The
clean-room screen found no employer code, configuration, identifier, internal
service, credential, private identifier, or other stop condition.

- **The categorical absence-as-brake rule was a synthesis overreach**
  `superseded`
  - The founding **AuthorityEnvelope as structural type**, **Vaal skill as
    evidence-gated authority escalation**, and **Per-action autonomy envelope**
    entries remain useful except for their claim that elapsed operator absence
    may never participate in authority growth. That clause did not preserve the
    operator's original upside-down-curve proposal. ADR-0007 supersedes the
    categorical direction while retaining explicit bounds, typed effects,
    per-action utility, and honest escalation lineage.
- **Presence and elapsed absence are policy inputs, not grants with a built-in
  direction** `adopted`
  - A versioned instance policy may hold, shrink, grow, peak, step, stop, reset,
    or loop work scope and effect authority within a declared ceiling when the
    owner deliberately chooses those transitions. Recorded clock/presence
    events—not ambient time—can satisfy a preauthorized transition; without
    such a policy, elapsed time implies nothing. This is neither agent self-
    promotion nor inferred consent.
- **Attention, scope, authority, and external capability are separate axes**
  `adopted`
  - Absence may reorder which work is attractive, enlarge the amount or breadth
    of work, select a broader effect envelope, or do any combination of those.
    The inspector must name the axis that moved. None of them can conjure an
    adapter, account permission, sandbox exit, provider cooperation, or other
    capability the active environment does not expose.
- **Return-ready housekeeping can coexist with progressive autonomy** `adopted`
  - Maintenance remains attractive during absence because bounded cleanup can
    reduce the owner's reorientation cost on return. That is a priority and
    disruption judgment, not evidence that authority must decay. Material
    changes, unresolved decisions, and continuation state still need a legible
    return projection rather than being hidden in churn.
- **Blackjack +3 is a candidate explicit subgame for progressive stakes**
  `preserved`
  - The operator's working lens is an actual bounded game surface, not merely a
    casino metaphor pasted onto a scalar. Qualifying rounds may advance the
    stake, while a selected boundary or event resets or loops play. Dealing,
    the meaning of `+3`, stakes, loss conditions, unlocks, caps, and reset rules
    remain open for a later design and representative fixture.
- **The walking skeleton proves one conservative fixture, not the policy
  family** `adopted`
  - Repo Gardener currently lacks deletion authority, runs on an away-only
    cadence, and cancels future pulses on return. Those facts remain correct for
    that scenario. They do not establish a platform invariant or choose the
    author's eventual personal PresencePolicy.

## WO-016 ideation breakout — owner sovereignty and platform/instance separation (2026-09-03)

Source: the operator's live `ideation:` dispatch and immediate same-batch
correction, captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. Ordinary Shape-First
Synthesis carries the architectural distinction without promoting the raw
metaphor used to describe accepted personal risk. No Direct Draft Fidelity
exception was requested. The clean-room screen found no employer code,
configuration, identifier, internal service, credential, private identifier,
or other stop condition. The immediate correction controls where the first
message and earlier assistant framing differ.

- **Platform mechanisms are not personal doctrine** `adopted`
  - DotLn can define composable authority, evidence, verification, history,
    replay, audit, safety-policy, and inspection mechanisms without requiring
    every implementation to activate them. A shared contract binds the meaning
    of a capability when declared; it does not turn the author's preferred
    loadout into platform law.
- **The author's strict loadout remains binding here, not universal** `adopted`
  - Scoped authority, evidence before completion claims, replayable records,
    independent review, and the repository's Clean Room boundary remain rules
    for this repository and the author's personal implementation. They are a
    proving ground and reusable reference content, not conformance requirements
    silently imposed on unrelated DotLn owners.
- **An owner-sovereign implementation profile is legitimate instance content**
  `adopted`
  - A controlling owner may eventually choose standing or direct authority,
    fewer confirmations, advisory or absent warnings, owner-accepted outcomes,
    or reduced assurance and history for systems and resources they control.
    This need not ship preconfigured or active. Exact identity,
    authentication, activation, persistence, revocation, and compound-command
    semantics remain open rather than becoming a global bypass switch.
- **Capability absence is a truthful state** `adopted`
  - An implementation may be explicitly unverified, unrecorded, or
    non-replayable. DotLn should expose that absence instead of manufacturing a
    weaker artifact under a stronger name. Owner control removes DotLn policy,
    not provider, harness, operating-system, destination, or other independent
    boundaries the platform does not own.
- **Platform and personal implementation coexist here while their physical
  split remains open** `preserved`
  - Documentation and capability declarations separate the two layers now.
    Package, directory, manifest, conformance-suite, and saved-profile
    boundaries wait for representative implementation evidence; coexistence in
    one repository is not permission to blur their guarantees.

## WO-016 expanded documentation review — executable shelf, fitted loadouts, and convergent judgment (2026-09-03)

Source: the operator's live expanded-scope review during WO-016. The
Barnes & Noble passage was already operator-authored public wording in the
vision; the operator explicitly nominated it for the README lead while leaving
its vision placement available. Reusing it verbatim at the front door therefore
uses Direct Draft Fidelity rather than treating it as agent-authored synthesis.
The remaining wording is a clean-room synthesis of the operator's critique. No
employer code, configuration, identifier, internal service, credential, private
identifier, or other stop condition was present.

- **The executable shelf is the front-door thesis** `adopted`
  - The operator's full shelf-to-agent-structure quotation now opens the README
    and remains in the vision's differentiated-interface section. A compact
    translation follows it: DotLn turns hard-won ways of working into
    inspectable programs for AI teams. Together they name the surprising idea
    and the product being built instead of asking a newcomer to infer both from
    a mood line.
- **“Stay with the idea. Let DotLn carry the work around it.” is no longer the
  primary tagline** `preserved`
  - The phrase remains available in lineage, but the operator found that it did
    not sell, compact, or explain the product strongly enough to lead the
    repository. Removing it from the front door does not reject the operator-
    flow mission it was trying to express.
- **Fitted gear supersedes the mixed stash/support explanation** `superseded`
  - Current explanatory surfaces retain “the whole stash into every map,” then
    map it consistently to carrying gear for every damage type when the
    encounter calls only for cold resistance. This supersedes the 2026-09-02
    sharpening “as if every support were linked to every skill” on current
    product surfaces because that second comparison changed the object being
    mapped and obscured the point. The older entry and historical receipts stay
    intact.
- **Operational formulations approach felt judgment by convergence** `adopted`
  - Poincaré's “felt rather than formulated” is a limit on claims of exhaustive
    representation, not a dead end for useful machinery. DotLn preserves source
    incidents, tries candidate mechanisms from different directions, and uses
    regression fixtures to see where each construction agrees or diverges. Like
    mathematical or geometric techniques converging on a shape, a compiled
    formulation is an instrument for approaching the selection function, never
    a claim to contain the judgment itself precisely.

## WO-016 implementation — one reactor drives live and replay (2026-09-03)

Source: the active WO-016 implementation episode on the published `v0.3.5`
base, staged for application release `v0.3.6`. These entries describe the
implementation subject awaiting independent verification and final review; they
do not predeclare either verdict.

- **The walking skeleton is now an instance of the kernel loop** `adopted`
  - One pure, typed `seiriReactor` owns every scenario decision. The live host
    supplies fakes, time, append-only persistence, and effect execution, while
    replay decodes the same log and drives the same reactor through the kernel's
    `replay()`. Complete `Decision` values and semantic projections are compared
    rather than trusting two event-type scripts to resemble each other. This
    closes the dated WO-016 gap without rewriting the historical evidence that
    exposed it.
- **Consequential skeleton events now carry canonical lineage** `adopted`
  - Derived events identify their cause, and pulse- or command-scoped events
    carry a correlation identifier where one exists. Event identity, type,
    payload, and user-facing default output remain stable; the audit projections
    can expose stronger groupings without guessing that adjacent records belong
    together.
- **Audit association still needs a link-first fold with a strict historical
  fallback** `preserved`
  - WO-016 deliberately leaves the audit implementation unchanged. Its
    verification association can consume the new explicit link, but other
    historical grouping paths still depend on adjacency. A follow-on should
    prefer valid cause and correlation links, label any legacy fallback, and
    reject cross-scope or decoy adjacency rather than silently widening a group.

## WO-016 ideation breakout — running worlds and commander-mediated tactics (2026-09-03)

Source: the operator's live `ideation:` dispatch and same-batch follow-up,
captured unedited in
`docs/intake/notes/WO-016-expanded-ideation-2026-09-03.md`. Ordinary
Shape-First Synthesis preserves the interaction shapes while keeping the raw
wording local-only; no Direct Draft Fidelity exception was requested. The
clean-room screen found no employer code, configuration, identifier, internal
service, credential, private identifier, or other stop condition. The operator
explicitly preauthorized continuation of WO-016 after this breakout.

- **An ambient social world belongs in DotLn's intended early application
  cohort** `adopted`
  - `προτείνω` already names the first-party destination for targeted prose in
    a simulated community. This refinement makes its continuity explicit: the
    world has routines, relationships, activities, constraints, and decisions
    in motion before the operator speaks, and modeled life continues between
    interventions. “Runs” means autonomous modeled continuity, not an always-on
    process, a wall-clock rate, or a selected engine. Early application intent
    does not change the current platform release ladder or widen WO-016.
- **Natural addressed speech remains data even when it is ambiguous, blunt, or
  hostile** `adopted`
  - The operator may select one resident or an addressable group and write
    naturally. The application retains the source, delivery force, intended
    recipients, subject, and uncertainty instead of silently laundering an
    abrasive utterance into polite advice. Selection does not imply uniform
    delivery, interpretation, or response: recipients may miss, ignore,
    refuse, reinterpret, try, adapt, or relay it differently, and delayed or no
    effect remains a valid result. Wording alone grants no authority and proves
    no hidden mental state.
- **A commander-mediated strategy game is the later sibling shape** `adopted`
  - In a later strategy vertical or specialized activity, the operator works
    through a world-situated commander instead of micromanaging every unit. The
    commander offers genuine tactical alternatives; the operator may accept
    one, combine or edit several, depart from them in prose, or decline. An
    option remains a proposal until the resulting tactic is interpreted,
    checked against current world state and authority, and deliberately issued.
    Whether this is a separate application or a `προτείνω` projection remains
    open.
- **Commander options, operator riffs, execution, and outcomes retain separate
  lineage** `adopted`
  - Preserve the path from situation and bounded commander observation through
    proposed alternatives, operator selection and revision, interpreted
    tactic, authorization, issued orders, actual unit behavior, and evaluated
    outcome. Replay and paired branches can compare an original option, its
    operator-authored riff, and no action from a shared checkpoint. A compelling
    rationale is not execution evidence; following the tactic and achieving a
    useful result are different claims. Ad hoc tactics remain bounded,
    inspectable application artifacts and are promoted into reusable mechanics
    only through an explicit evidence-backed proposal.
- **Behavior attachment is capability-based rather than animate-only**
  `adopted`
  - An apparently inert prop does not receive a blanket exemption from the
    intervention system. If a world object, object class, or selected set is
    addressable and its declared capabilities can support an effect, the
    operator may propose a bounded behavior for it just as they can target a
    resident. This does not make the object sentient or assume it interprets
    prose; an application-owned compiler or rule surface may lower the proposal.
    Unsupported or unauthorized effects remain visibly unavailable or refused.
- **Contingent object behavior is a replayable temporal rule, not prompt
  decoration** `adopted`
  - The carried shape is a prop that gains a dramatic simulated reaction after
    a named utterance recurs consecutively to a declared threshold. The rule
    owns target scope, observation/reach, normalized trigger identity, count,
    ordering, reset and duplicate behavior, lifetime, effect, compatibility,
    authority, and evidence. A high-strength suggestion is still a proposal,
    not silent installation; once an authorized rule participates, its matched
    source events, state transition, emitted effect, and replay remain
    inspectable. Exact object taxonomy, trigger grammar, and rule-acceptance
    model remain open.

## WO-017 final review — the deferred evaluable-subset type candidate (2026-09-03)

Source: WO-017's non-goals, which defer the `Cadence.Evaluable` recursive
subset type and direct that it be recorded as a candidate, and VER-001 finding
F1, which observed that the exported kind lists are shallow by shape. Recorded
by the final reviewer as the handoff correction the verifier asked for; no
implementation, contract, acceptance, or evidence surface changed.

- **A recursive evaluable subset type for Cadence and Program remains a
  candidate** `preserved`
  - `EVALUABLE_CADENCE_KINDS` and `EVALUABLE_PROGRAM_KINDS` are exact by root
    kind and shallow by shape: `Gate(Burst(2, 1), ref)` and
    `Sequence([All([])])` throw `is deferred` even though `Gate` and `Sequence`
    are listed. A `Cadence.Evaluable` and `Program.Evaluable` recursive subset
    type, with a matching runtime predicate, would let a consumer such as
    WO-018's release manifest state evaluability over whole trees rather than
    root kinds. Until a bounded order pins it, the kernel README carries the
    caveat and the exported lists remain root-kind data only.

## WO-017 ideation breakout — exact lexicons and contributed capacity (2026-09-03)

Source: the operator's live `ideation:` dispatch and correction, preserved
unedited in
`docs/intake/notes/WO-017-expanded-ideation-2026-09-03.md`, plus the local
`docs/intake/images/dual-survival.webp`. Ordinary shape-first synthesis applies
to the crash-reporting and contributed-capacity mechanisms, including the DBZ
reference. Direct Draft Fidelity is requested only for the manually checked
_Dual Survival_ transcription, the separately supplied _Man, Woman, Wild_
phrase, and the Westworld command vocabulary because the operator explicitly
corrected an attempted generalization and made exact wording their filing
requirement. On 2026-09-03, the operator confirmed authorship of the _Dual
Survival_ list/compilation shown in the local image and explicitly authorized
its exact text for public filing in this repository. The clean-room screen found
no employer, credential, internal-service, private identifier, or other stop
condition. The operator preauthorized continuation of WO-017 after and during
this breakout; the work-order receipt keeps the documentation expansion
separate from its implementation authority.

- **A crash or bug reporter minimizes locally before projecting an Issue**
  `transformed`
  - The desired capability may appear as a failure-triggered active and a
    runtime-native agent skill. It selects the smallest correlated slice from
    governed local diagnostics, adds reproduction and public-safe version facts,
    deterministically redacts and previews the packet, then either creates a
    local draft or—under a narrow, expiring, revocable external-effect
    envelope—submits exactly one deduplicated GitHub Issue. Raw logs,
    credentials, resolved targets, unrelated lines, conversation history, and
    private identifiers do not cross. The Issue is an intake projection, not
    canonical truth, priority, repair authority, or independent verification.
- **The _Dual Survival_ list is an exact output palette, not generic survival
  flavor** `adopted`
  - The exact list, including words, phrases, sentence constructions,
    capitalization, punctuation, and cooldown annotations, is filed wholesale
    in `05-pattern-library.md` from the operator-supplied local image. A
    phrasebook support tries to use those literal entries while leaving factual
    content, evidence, authority, and the separate mitigated-speech `Voice`
    unchanged. Private/source-derived palettes retain provenance and destination
    policy. The first _Man, Woman, Wild_ addition is exactly
    `this is truly desperate living`; a recorded unavailable or explicitly
    degraded state may make it eligible, but it never licenses silent model
    substitution.
- **Westworld contributes an exact operator command lexicon** `adopted`
  - The fourth recorded Westworld shape is deterministic control through
    source-exact command phrases. `analysis:` is the first and only token
    supplied in this batch. It requests an operator-visible analysis artifact or
    analysis-only episode, not private model chain-of-thought. The remaining
    slots stay empty until the operator supplies or source-reviews exact text;
    remembered approximations and paraphrases do not compile. Commands may
    pause or bind application workflow, but never bypass safety, Clean Room,
    permissions, evidence gates, or external-effect authority.
- **Community members can contribute their own excess Fable capacity through
  local WorkOrders and pull requests** `transformed`
  - The DBZ reference remains as a lineage cue: a Goku/Spirit Bomb-style call
    for contributed energy, paired with regenerating Dragon Balls as the image
    for renewable capacity. Mechanically, DotLn offers an already-reviewed,
    model-specific bounded WorkOrder; a participant uses their own local harness
    and provider relationship, transfers no account or credential, and returns
    a patch, typed result, evidence, and actor attestation in a PR. The result
    remains untrusted and independently verified. Available quota can lower the
    cost of eligible work but cannot invent tasks, manufacture priority, or
    outrun operator review bandwidth; provider eligibility is rechecked as
    environment truth.

## WO-027 bounded local-inference probe (2026-09-03)

Source: WO-027's public work-order authority, public vendor documentation, and
sanitized observations of the personal machine. No intake material was
promoted, no model artifact was downloaded, and the clean-room screen found no
employer, credential, internal-service, or other stop condition.

- **Local inference now has pinned capability truth, not a claimed runtime
  integration** `adopted`
  - The probe observed LM Studio `0.4.13+1`, pinned an existing 7B Q8_0 GGUF by
    byte size and SHA-256, and proposed `runtime.local-inference` at maturity
    level 0 / E0. The sole permitted service launch crashed before readiness,
    so there were zero load or generation outcomes and the pinned capability
    table did not change.
- **The calibration order is deferred under a named condition** `adopted`
  - Filing a 100-run calibration with no verified completion would be Naive
    Interventionism. Reconsider after an available runner completes the fixed
    three-request smoke under a boundary that permits localhost while denying
    non-local egress, including deterministic-output and during-generation
    socket evidence. Reevaluate on a runner install or operator-chosen fix, and
    otherwise quarterly.
- **The corrected profile's loopback result is evidence for the next probe,
  not retroactive egress evidence about the failed runner launch** `adopted`
  - The actual launch profile failed against a verified loopback listener. A
    later disposable self-test reached loopback under a corrected profile, but
    external requests in both tests ran under combined boundaries and emitted
    no boundary diagnostic, so the denying layer remains ambiguous. LM Studio
    was not relaunched; crash causality and runner behavior under the corrected
    profile remain ambiguous too.
- **The hybrid local-first calibration cell remains available** `preserved`
  - Deterministic parsing followed by local derivation and an approved remote
    capsule is still a candidate alongside deterministic-only, local-only, and
    direct-remote cells. It is not scheduled until the named condition makes a
    calibration order evidence-bearing.

## 2026-09-03 primitives-and-data planning (operator-dispatched, after the `v0.3.4` close)

Source: the operator's 2026-09-03 planning dispatch after the `v0.3.4` release
close, preserved locally as a compaction-safety capture in
`docs/intake/notes/WO-027-WO-028-primitives-and-data-planning-2026-09-03.md`.
The session was asked to run like the entropy review, to equip Beware of Naive
Interventionism and Do Nothing, and to check the recent ledger entries for
primitives to add, data to start or stop storing, and metrics that improve only
if a change lands now. It nominated WO-027 and WO-028 as planner-synthesized
drafts, refreshed the work-order map, and repaired the publication index.
Identifiers are opaque stable references; nomination records a finding and a
bounded route, not activation authority. The clean-room screen found no
employer, credential, internal-service, or other stop condition.

- **A planning pass equips Beware of Naive Interventionism and Do Nothing, and
  records a NoOp with its reversal condition for every candidate it declines**
  `adopted`
  - This applies the 2026-09-02 entry that made intervention restraint
    phase-selective: bare ideation carries only the Clean Room floor, while a
    change-proposing phase equips the counterweight by default. Each candidate
    below states act or do nothing, the evidence, and what would make action
    useful, in the `NoOpIntent` shape from the domain model. Recording the
    declined candidates is the point: a later pass can see what was weighed
    instead of weighing it again.
- **No primitive changes are needed now; one optional field on one public
  surface is the only store-it-now-or-lose-it item** `adopted`
  - The recent entries — influence response policies, memory cuts, temporal
    fidelity, local inference, the private evidence lane, model-input exposure,
    and effort-quality experiments — all lower onto primitives that already
    exist (`EventEnvelope`, `Comparison`, `AuthorityEnvelope`, `WorkOrder`,
    Active and Support mechanics, `NoOpIntent`) or onto application-level
    candidates already recorded in 11-proteino and 09. Nothing stored today
    should stop being stored: the public control log carries harness, model,
    effort, and source by deliberate choice and no private-lane value. The one
    gap is below.
- **Control events record no time; every phase duration the repository has
  lived through exists only as local checkpoint-ref commit dates** `adopted`
  `recovered`
  - Measured at `v0.3.4`: 98 events, 12 work orders, no time-bearing field.
    83 events name a local `refs/dotln/checkpoint/...` commit whose committer
    date is the only record of when the transition happened; those refs are
    never pushed, so a fresh clone holds none of it, and 15 events have no
    recoverable time at all. Three queued consumers need the field: the
    operator's effort-quality comparison (elapsed time is the cheapest
    dimension of the resource vector), WO-021's beacon mtime, and WO-026's
    index. WO-028 is the bounded route: an optional `recordedAt` at append
    that the fold never reads, an elapsed projection, and a one-time labeled
    recovery of historical times as a dated observation, never a backfill of
    the log. It follows WO-018 so the consolidated library is edited once; the
    local refs preserve the history until then, on this machine only.
- **The local-inference probe is nominated; the calibration order is
  deliberately not filed** `adopted`
  - The roadmap's standing instruction to the next planning pass is
    discharged by WO-027. A read-only existence check found LM Studio installed
    and Ollama, llama.cpp, and MLX absent, on an M3 Max with 48 GB. The
    calibration order (a 100-run baseline with role, mechanics, and combined
    cells) waits for the probe's decision packet: filing it before
    determinism, cost, and egress are observed would be the naive intervention
    the roadmap itself warns against.
- **A runner's inventory command can be a process launch** `adopted`
  `recovered`
  - The planner ran the LM Studio CLI's listing commands as read-only
    discovery. The CLI woke the desktop app, which the operator watched open
    and crash, and the listing timed out. Recorded as an incident for the
    feedback corpus WO-011 compiles from: classify a discovery command by its
    side effect before running it on the operator's machine, and let a
    discovery order's authority text name the commands that launch processes.
    WO-027 carries that rule and treats the crash as its first observation.
- **The publication index went stale on `main` and nothing gated it**
  `adopted` `recovered`
  - At `v0.3.4`, `publication:check` fails: five candidate headings written
    back during the WO-019 ideation breakouts have no audience/status row and
    both edition locks are stale. The staleness mechanism worked; the gate did
    not run, because `npm test` does not yet exercise `check-publication.mjs`
    against the real repository (WO-018 criterion 6). This pass repairs the
    index and locks as bounded adjacent cleanup with a recapture, since its
    own roadmap edit re-stales them; WO-018 remains the durable gate.
- **Declined candidates, each with its reversal condition** `preserved`
  - A recipient-side influence response policy primitive (semantic-band gate,
    cumulative reducer, windowed fold, internally anchored): NoOp. It is
    `προτείνω` material with no input stream to fold today; useful when the
    first evidence slice or a second influence-bearing input source exists.
  - A typed, ablatable model intervention point (predicate, bounded input,
    output schema, budget, downstream event): NoOp. No model call crosses a
    boundary DotLn controls until WO-009, and the existing Active mechanic,
    `AuthorityEnvelope`, and `WorkOrder` already carry the shape.
  - The private evidence lane, its offline maintenance tools, and the Snooping
    Footprint Reducer: NoOp. There is no private datum to govern and no
    runtime sensor to inventory; useful when the operator names the first
    record they want processed but not published, or when WO-009 gives DotLn
    its first model input and output to minimize.
  - Machine-readable finding counts, token, cost, or attention fields in
    reports and completion events: NoOp. The effort-quality comparison must
    predeclare its evaluators first; measurement follows the declared
    experiment, and resource telemetry is a private-lane candidate.
  - A release-manifest projection of completion actors and times: NoOp.
    WO-026's index derives both from the control log, so a manifest field has
    no consumer yet.
  - A `runtime.local-inference` row in the pinned capability table: NoOp on
    the table itself; WO-027 proposes the row inside its discovery doc.
  - A forward-only lint against absolute home paths in new reports (they
    appear in immutable WO-007 and WO-015 reports, as WO-007 VER-002 noted):
    NoOp. The author's identity is already public through authorship; useful
    as a rung once the Snooping Footprint Reducer or WO-026's check chain
    exists.
  - Pushing the local checkpoint refs to preserve timing: NoOp. It is a
    disclosure decision about work-in-progress trees, and WO-028's recovery
    removes the need.
- **WO-023's pull-forward trigger has arguably fired** `preserved`
  - The map allowed pulling the compiled reviewer forward "if the compiled
    reviewer is wanted in service sooner." Three manual review or planning
    sessions have run since its nomination, each without a blinded refutation
    pass. The recommended sequence keeps WO-023 after the beacons; the
    operator may pull it to directly after WO-016 if a fourth session is
    wanted before WO-021 closes.

## WO-019 repair-window ideation — influence response and fictional-system translation (2026-09-03)

Source: the operator's live `ideation:` dispatch, preserved unedited in
`docs/intake/notes/WO-019-expanded-ideation-2026-09-03.md`. Ordinary
shape-first synthesis found no employer, credential, internal-service, or other
clean-room stop condition. The scientific and fictional references remain
operator recollections and familiar lenses; no literal physics or canon claim
is load-bearing. The operator separately preauthorized continuation of the
WO-019 fix after this breakout.

- **Influence streams need selectable response policies, not one universal
  aggregation rule** `adopted`
  - A recipient's versioned policy can determine how a time-ordered stream of
    eligible external expressions participates in a decision. The first open
    inventory contains a semantic-band gate, where any number of lower-band
    suggestions remains distinct from one qualifying urgent signal; cumulative
    aggregation through a declared reducer; a bounded count- or time-window
    fold; and an internally anchored path where outside expressions may be
    understood but contribute no decision pressure. These are alternatives and
    ingredients, not an exhaustive enum or claims about human psychology.
  - Preserve source and provenance, communicative `Voice`, urgency, evidence,
    relationship or trust, timing, admission, and policy result as separate
    facts. Repetition does not become truth, message force does not create
    authority, and aggregation cannot weaken a hard constraint. A trace shows
    which inputs were admitted, ignored, combined, or decisive. This is
    distinct from mechanism-loading `AttentionPolicy` and from collapsing
    evidence, activation, preference, urgency, and permission into one scalar.
- **A rule-rich fictional source can be both a pattern mine and a comprehension
  tool** `preserved`
  - The operator nominates _Jujutsu Kaisen_ for a later source-grounded pass
    over abilities, prerequisites, conditions, costs and limits, interactions,
    problem-solving strategies, and changes in effective capability. The same
    explicit model could help a viewer understand the work by projecting rules,
    state, dependencies, exceptions, and uncertainty instead of merely
    summarizing plot. Canonical source claims, operator interpretation,
    extrapolation, contradiction, and unknown remain distinguishable; no
    series-specific noun or rule becomes kernel ontology.
- **An analogy is a translation view over an explicit model, not a substitute
  for it** `adopted`
  - The operator's recollection of an in-story immortality explanation through
    a familiar fictional evolution comparison demonstrates a nested familiar
    lens: one fictional system can help explain another. Preserve the analogy
    and formal rule model as synchronized but non-identical projections, mark
    lossy or uncertain correspondences, and verify literal details only when
    they become load-bearing. This extends the existing three-lens and
    shape-first rules without selecting a new schema or implementation.

## WO-019 execution-window ideation — memory cuts, effort experiments, and local inference (2026-09-02)

Source: the operator's live `ideation:` dispatch, preserved unedited in
`docs/intake/notes/WO-019-expanded-ideation-2026-09-02.md`. Ordinary
shape-first synthesis found no employer, credential, internal-service, or other
clean-room stop condition. The same dispatch explicitly authorized continuation
of WO-019 after this breakout.

- **An editable recap is a simulation-scoped memory intervention** `adopted`
  - In the `προτείνω` candidate, the operator can assemble all, none, or a
    selected strip of a resident's recorded life and use that derivative to
    prime what is accessible at a declared boundary. Crops, emphasis, ordering,
    filters, and detail substitutions retain source references and exact
    transformation provenance. The canonical event history never changes to
    agree with the edited memory.
- **History, observation, accessible memory, belief, and stance stay distinct**
  `adopted`
  - Surrounding residents may retain full-history awareness while the selected
    resident receives only a recap, but both are declared world rules. Whether
    another resident knows, suspects, or misunderstands that boundary is
    separate from how they react to it. Sympathy, revulsion, or another stance
    emerges from resident and relationship state rather than being hard-coded by
    knowledge alone; disclosure, consent, manipulation authority, and exit
    conditions remain inspectable.
- **Film-editing controls are semantic only when they alter perception**
  `transformed`
  - The film-strip analogy becomes an authoring view over a versioned memory
    cut. A monochrome treatment, crop, or filter that affects behavior must name
    the semantic transform; otherwise it is cosmetic projection. A false detail
    is displayed as a counterfactual difference from history rather than
    transmog, narration, or an invisible rewrite.
- **Whole work orders are the default unit for effort-quality experiments**
  `preserved`
  - The operator hypothesizes that declared `xhigh` or `max` may outperform an
    unmapped `ultracode` label for Opus and Fable verification/review without
    subdividing an already bounded work order. The same day brought markedly
    lower token/cap consumption on one account. Preserve both as motivation for
    a controlled comparison, not causal evidence; quality, resource use, role,
    model, effort, and order complexity need comparable observations before a
    routing or decomposition rule changes.
- **Local inference is a first-class runtime target behind capability truth**
  `adopted`
  - A local model can occupy the existing model slot through a discovered
    runner/harness/environment lowering. It offers a valuable no-provider and
    potentially no-network lane without creating a new actor kind, but local
    compute, memory, context, latency, energy, and thermal limits remain visible.
    A verified no-egress state and exact model artifact, quantization, runner,
    prompt template, decoding, seed, and hardware profile precede comparison.
    The operator requests the earliest practical adoption: the next planning
    pass should run or nominate the smallest bounded runner/no-egress capability
    probe and decide whether to file the calibration work order, without
    expanding WO-019 or bypassing existing dependencies.
- **Repeated story generation becomes controlled loadout calibration** `adopted`
  - Begin with the same pinned story-generation case and a proposed 100-run ordinary
    baseline, then compare baseline, role-only, active/support-mechanics-only,
    and role-plus-mechanics cells—each a distinct compiled loadout—with
    randomized or interleaved ordering and predeclared quality/resource
    evaluators. The repetition count remains a hypothesis. Preserve
    distributions, pairwise judgments, disagreement, and failures rather than
    collapsing fluency into one score.
- **Compiled senses make model intervention sparse and ablatable** `adopted`
  - Static maps and file-derived signals can be authorized, versioned state
    projections available to an actor without another model call. Deterministic
    dispatch grammar can remove language interpretation at known intervention
    points; only residual semantic judgment reaches a model, and each such seam
    should be independently removable and compared with a deterministic-only
    branch. Roles, active/support mechanics, senses, identity, environment, and
    other loadout ingredients remain distinct graph dimensions rather than a
    newly fixed three-axis ontology. This reinforces the existing architecture
    and does not expand queued WO-022 beyond its declared beacon-perception
    scope.
- **The clean-room floor is universal; intervention restraint is phase-selective**
  `adopted`
  - Bare ideation always carries the locked employer/secret screen, source
    treatment, public-destination vocabulary, and provenance, but does not
    automatically equip Beware of Naive Interventionism. Divergent capture is
    not a change proposal. Planning and other change-proposing phases are the
    support's natural default; a high-consequence ideation promotion may opt in
    explicitly. The support can narrow or decline a clean transformation after
    the hard screen, never weaken that screen. This specializes rather than
    erases the earlier clean-room composition entry.
- **External interactions disclose the builder, never the private target**
  `adopted`
  - Public definitions may identify the generic URL-builder or adapter contract,
    version, and operation class. Binding availability and result class stay
    local unless a selected public profile permits their sanitized projection.
    Resolved endpoints, tenant/workspace identifiers, route and query values,
    credentials, and reversible target fingerprints remain in operator-owned
    local configuration and do not enter remote model prompts, repositories,
    portable/public artifacts, or public canonical logs. An explicitly
    authorized local processor may consume a resolved value transiently without
    retaining it. This answers surveillance fatigue with inspectable behavior
    rather than an accumulating registry of where a person goes.
- **Model-input exposure is inspectable and adjustable before invocation**
  `adopted`
  - A remote-model boundary should not hide behind the binary label “uses AI.”
    Its local preflight names every planned input edge and whether it exposes
    verbatim content, structural shape, subject/tag metadata, derived or
    inferred material, related/adjacent context, or accidental co-travellers
    such as tool output, screenshots, diagnostics, and conversation history.
    The operator sees the destination class and can compare compiled choices:
    omit or select fields, redact/derive locally, substitute synthetic data,
    route residual judgment to a verified local model, use a deterministic
    path, or cancel—with capability, quality, cost, and evidence consequences
    visible and no silent remote fallback. A local model is not assumed private:
    no-provider and no-egress claims require runner, context, storage,
    diagnostic, and outer-boundary evidence. Exact previews and receipts stay
    local; only profile-approved aggregate claims may enter public artifacts.
- **A hybrid local-first model route is a candidate initial topology**
  `preserved`
  - Deterministic grammar handles what it can; a bounded local model can propose
    tags, associations, redactions, and a candidate bounded WorkOrder/context
    capsule from private free-form input; a stronger remote model can then
    receive only the approved capsule and public-safe evidence for planning,
    coding, or another complex episode after the existing authority gate. This is not yet a fixed routing rule, model-role assignment, or
    claim that today's capability gap will persist. The operator's directional
    hypothesis is that local hardware and model progress will only improve the
    route; the durable consequence is to re-profile dated
    model/runner/hardware combinations and permit work to migrate locally rather
    than freezing a caste. Local semantic derivations are fallible and can
    themselves be sensitive, so they retain uncertainty and lineage and remain
    inspectable/bypassable. A
    remote actor that needs more source material must request a newly previewed
    input edge rather than acquiring adjacent context implicitly.
- **Model disclosure routes are operator-wired graph semantics** `adopted`
  - Data-bearing primitives, roles, and linked supports declare compatible input
    and destination classes. The operator may wire a link group to local
    inference, remote inference, both as explicit stages, or neither; the
    compiler renders every boundary crossing and the capability lost when a
    route is absent. This generalizes the privacy choice without hardcoding the
    hybrid example as a universal pipeline. Operator choice remains bounded by
    authority and the locked Clean Room floor, and no component acquires extra
    disclosure authority merely because more context would help it.
- **Privacy-chosen unavailability is a capability deficit, not invented work**
  `adopted`
  - When an operator withholds an external target binding, the dependent feature
    is visibly unavailable and the product records the limitation without
    guessing a URL or calling the absence a defect. A feature explicitly
    declared available with a valid binding still owes ordinary correctness;
    this distinction cannot excuse a broken adapter or a false capability claim.
- **Edge claims remain claims; epistemic labeling replaces ambient surveillance**
  `transformed`
  - An external actor or test double may report an arbitrary value—including an
    effort of `max` when the effective value was `low`—without DotLn expanding
    collection to prove otherwise. The canonical event is true about receipt of
    a `self-reported` claim, not omniscient about the underlying setting; a fake
    adapter can exercise the same seam. DotLn may not fabricate the receipt,
    mutate history, or upgrade its source label. The literal permission to
    silently violate declared effort is not adopted because it conflicts with
    WO-019's active authority; a corresponding lie about a required model would
    also conflict with Principle 8. Changing either obligation would require an
    explicit amendment or supersession, while accepting the evidence limit
    requires none. A contract may require a stronger source; unavailable
    evidence then produces refusal or a visible capability deficit rather than
    surveillance or relabeling.
- **A Snooping Footprint Reducer periodically proposes less observation**
  `adopted`
  - The recurring maintenance active inventories fields and sensors read,
    adapter/builder classes, purpose, flow, retention, evidence dependencies,
    and the capability cost of removal without opening the underlying private
    values. It proposes deletion, coarsening, local resolution, shorter
    retention, on-demand access, synthetic seams, or an honest deficit through
    deduplicated `ProductSuggestion` records. It may attach an independently
    reviewed candidate work order to a proposal packet but cannot create an
    authoritative work order, schedule itself, or promote its own output. Its
    “from time to time” wake-up becomes an explicit cadence plus material
    adapter/schema-change triggers. Detailed field/sensor evidence stays local;
    only a profile-approved sanitized suggestion or non-disclosing reference
    crosses into a public proposal.
- **Richer evidence is an opt-in local sink, not portable ambient telemetry**
  `adopted`
  - Individuals and organizations may deliberately retain values the portable
    default omits. Pure functions wrap, minimize, and label approved data; a
    distinct authorized adapter writes it to an operator-configured ignored
    location under explicit scope, retention, access, and deletion policy.
    `gitignore` prevents accidental versioning but provides no confidentiality,
    encryption, backup, or deletion proof, so implementations must describe
    those environment properties honestly. Neither the resolved path nor the
    retained values enter portable artifacts.
- **Public Git and private audit data form a two-lane promotion boundary**
  `adopted`
  - The personal build keeps almost all definitions, code, decisions, and
    public-safe evidence committed, while data meant to be processed and audited
    but not published enters an intake-like ignored local store. Pure transforms
    derive views and Clean Room governs promotion of any sanitized result. The
    local governed record and committed public projection answer different
    claims; loss of the former cannot be hidden by the latter.
- **Event shape is data in the privacy threat model** `adopted`
  - Removing payloads still leaves types, order, counts, timing, identities,
    correlations, gaps, and access patterns. Public projections may need to
    omit, bucket, delay, aggregate, or replace those fields and must disclose the
    resulting loss of replay/audit power. Raw hashes and stable opaque IDs are
    not assumed anonymous. This candidate neither reclassifies the public resume
    log nor adds private-lane values to it; WO-019's separate actor fields still
    apply. Private runtime storage and projection need a later bounded design.
- **Private-lane maintenance is offline and Git-independent** `adopted`
  - Future tools may validate, transform, snapshot, rotate, restore, and delete
    private records through pure cores and contained local-filesystem adapters.
    They do not invoke Git, stage or commit data, inspect repository history as
    the data store, open sockets, or use a network backup destination. Their
    receipts, paths, contents, and keys remain local; public code uses synthetic
    fixtures. A same-device copy is labeled as such rather than advertised as
    disaster recovery, while explicitly configured removable offline media can
    be tested as a separate failure boundary.
- **The acting gems contribute evidence but do not self-certify isolation**
  `adopted`
  - Maintenance mechanics emit typed plans, transformation identities, touched
    local-root classes, and result receipts. Those prove declared and positively
    observed behavior. Proving that no Git or network effect occurred also needs
    an outer deny-by-construction environment, poisoned-capability tests, and an
    independent verifier. The linked attestations remain local when their paths
    or contents would disclose the private lane.
- **Composition proves participation per pipeline, including deliberate absence**
  `adopted`
  - A compiled link-group manifest can include an authorized `fetch`/XHR source
    adapter while demonstrating that optional payload-audit, logging, retention,
    and snooping supports did not participate in that data path. Required
    data-minimized authority/command/result evidence remains. A local receipt
    binds a specific invocation to the manifest and transformation versions;
    the pure transform subgraph proves its declared mapping, while adapter
    evidence proves invocation and outer confinement remains necessary to
    exclude hidden effects. The later maintenance pipeline stays offline even
    when acquisition did not.

## WO-025 ideation breakout — temporal fidelity and bounded future reachability (2026-09-02)

Source: the operator's live `ideation:` dispatch, preserved unedited in
`docs/intake/notes/WO-025-temporal-counterfactuals-2026-09-02.md`. The personal
game/calculator recollections and public technical concepts contained no
clean-room stop condition. Shape-first synthesis used Lamport's
[event-ordering account](https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/),
[Klosowski et al.'s k-DOP paper](https://doi.org/10.1109/2945.675649),
and Fujimoto's
[parallel discrete-event simulation survey](https://doi.org/10.1145/76738.76741)
as orientation, not as imported architecture.

- **Simulation time is independent of execution throughput** `transformed`
  - The frame-rate anecdote carries a durable distinction: how quickly a host
    folds events must not determine how much modeled time passes. Recorded
    replay may execute faster than wall time while preserving its event order,
    declared timestamps, and elapsed-time semantics; that acceleration does not
    mean causality moved faster inside the modeled world.
- **The event is a recorded granule, not a physical quantum** `transformed`
  - An event is the smallest individually addressable immutable
    observation/input envelope in DotLn's present log. Its granularity is chosen
    by the domain model; it does not establish the shortest interval, a
    universal maximum causal hop, or a fact about physics. Causal membership
    requires an explicit or honestly derived relation. Same-time and independent
    events also mean log order, modeled time, and causal dependence must remain
    distinguishable.
- **Counterfactual closure is relative to a declared observation boundary**
  `transformed`
  - A branch can be exact only relative to a named checkpoint, horizon,
    observable/evaluator set, world and component versions, randomness policy,
    and treatment of exogenous input. A closed-world simulation substitutes a
    declared model for relevant state and senses; a live coupled world cannot
    fabricate observations that have not arrived. This reframes the proposed
    need to model all relevant state and sensory input as sufficient closure for
    the claims being evaluated rather than a promise to reproduce all reality.
- **A causal propagation bound may be a world rule, not a kernel-wide clock**
  `preserved`
  - Some live mechanics may need real-time pacing, a cap on speculation beyond
    observed facts, or an explicit deadline/miss policy so overload never
    silently compresses outside time. Recorded replay and closed virtual worlds
    need not share that pace. Whether any domain needs a minimum causal delay
    that supplies lower-bound lookahead for safe advancement,
    one-event-at-a-time propagation, conservative waiting, speculative rollback,
    or another rule remains open.
- **k-DOP-inspired future envelopes are a broad-phase research hypothesis**
  `preserved`
  - Project a reachable-future set onto a small fixed family of meaningful axes
    and retain a conservative envelope `E` containing the modeled reachable
    set. A target/query set `T` can be pruned only when `T ∩ E = ∅`; overlap
    means merely “not ruled out” and still requires exact evaluation. The useful
    shape is fast one-sided exclusion without false-negative pruning, not
    instant enumeration or knowledge of every future. Hybrid, discrete, and
    non-convex behavior may require an abstract reachability representation
    rather than a literal geometric k-DOP.

## WO-025 implementation and operator-expanded presentation scope (2026-09-02)

Source: the activated WO-025 authority, the operator's live report that the
fixed-width PR and release-template prose rendered poorly on a 4K ultrawide,
and the cited release, compatibility, publication, and final-review contracts.
The live report contained no clean-room stop condition and was synthesized
directly into this receipt; no ignored intake source was mined.

- **Release-bearing source claims and component versions are checked at both
  publication boundaries** `adopted`
  - The active H1 was forward-corrected to the unambiguous next patch,
    `v0.3.3`. A delimited README block names the release of its source, and one
    non-mutating checker compares that claim with the H1 and latest published
    annotated tag before PR publication and again after close synchronization.
    The same checker compares each component's `src/` with the preceding tag
    and requires its package version to move when its source moved. The skeleton
    receives the dated `0.3.0` correction and derives its banner from its own
    manifest; the unchanged kernel remains `0.1.0`.
- **Public review prose is renderer-wrapped, not authored for an 80-column
  display** `adopted` `transformed`
  - The common cause was a formatter configured to reflow Markdown at the code
    width plus the same convention copied manually into formatter-exempt review
    artifacts. Markdown formatting now preserves authorial line breaks, while
    code retains its 80-column preference. New PR and release-note bodies use
    one physical line per prose paragraph or list-item paragraph, preserve
    semantic Markdown boundaries, and are checked on committed bytes before a
    remote mutation. Exact-byte transport remains the contract. Earlier PRs,
    immutable review packages, tags, and GitHub Releases are not rewritten.

## WO-024 implementation — reviewed release projection (2026-09-02)

Source: the activated WO-024 authority and its cited release/publication
contracts. The activation placeholder was forward-corrected to the map's
`v0.3.2` patch target without changing the append-only activation event.

- **One reviewed edition, deterministic tag record, recoverable public projection** `adopted`
  - A passing final review now supplies the same ordered five-section notes
    artifact for release and no-release work. Release close discovers passing
    work orders from first-parent control-log additions, preserves reviewed
    section bytes, labels only pre-WO-024 gaps with a commit-subject fallback,
    and appends diff-derived warnings plus manifest-derived evidence. Manifest
    schema 1 remains sufficient because the edition is re-derived from the
    tagged tree and compared byte for byte; no compatibility field changed.
    After the tag push, GitHub Release creation is a recoverable projection:
    rerun creates a missing body or refuses the first mismatch, never edits the
    tag or Release. Local `notes` and `list` commands stay offline, while
    historical backfill remains a separate explicit operator action.

## 2026-09-02 release-surfaces planning (operator-dispatched, after the `v0.3.0` close)

Source: the operator's 2026-09-02 planning session after the `v0.3.0` release
close, captured locally in
`docs/intake/notes/WO-024-WO-026-release-surfaces-planning-2026-09-02.md`. The
session nominated WO-024 through WO-026 as planner-synthesized drafts and
refreshed the work-order map's recommended sequence. Identifiers are opaque
stable references; nomination records the finding and a bounded route forward,
not activation authority.

- **Release notes are reviewed prose projected to where readers look; the tag
  stays the record** `adopted`
  - `v0.3.0` shipped with notes only inside its tag object, assembled from the
    work order's Objective paragraph and raw commit subjects, and the
    repository has no GitHub Release. The editorial content already exists in
    each final review's committed PR body. The reviewer therefore writes a
    five-section release-notes file as part of the passing package; release
    close assembles the edition for a tag from every such file merged since
    the previous release, keeps the annotated tag as the immutable record, and
    publishes the same edition as a GitHub Release under the existing
    release-close phrase (a bounded widening of that authority). No
    per-release commit and no second release PR: WO-004's decision stands.
    WO-024 is the bounded route.
- **A public surface states the release of the source it is in; currency is
  checked, not remembered** `adopted` `transformed`
  - The root README has only ever been edited inside work-order branches
    before the tag existed, so it can only describe the previous boundary, and
    release close pushes no commit. This transforms the WO-007 final-review
    stance that refreshing it after the release is ordinary follow-on
    documentation: a delimited release block names the version the tag will
    carry, `worktree publish` and `release close` check it against the work
    order's target and the latest published tag, and a component's version
    must move when its source moves. Version axes stay separate
    (10-ir-compatibility). WO-025 is the bounded route.
- **Work-order files are immutable addresses; open versus closed is a
  generated view** `adopted`
  - The operator asked whether open and closed orders should be separated.
    Paths are cited by immutable verification and final-review reports, the
    append-only control log, and tag manifests (106 references outside the
    directory at `v0.3.0`), and release close reads the closed order at its
    recorded path, so moving files would break records that cannot be edited.
    The pilot map has now been used across three closes and its hand-written
    evidence cells went stale at each; the 2026-09-01 navigation entry
    deferred exactly this decision to use. Route: generate an index from
    work-order headers, a per-order reduction of the control log, and tag
    manifests, checked fresh by `npm test`; the map keeps only recommendation
    and rationale. WO-026, after WO-018's consolidation.
- **A defect that recurs at every release is fixed before the next release,
  not after the next big rung** `preserved`
  - A sequencing observation, not a rule: unseen notes and a stale front page
    recur at every tagging close, so their fixes were placed directly after
    WO-013 rather than behind the larger queued orders; deferring them costs
    one more defective release per close. Recorded because the prior
    recommended sequence would have shipped three more.

## WO-007 repair-window ideation — Clean Room as an active (2026-09-02)

Source: operator clarification and ideation captured in the main checkout's
single-copy local intake at
`docs/intake/notes/WO-007-expanded-ideation-2026-09-02-clean-room-active-gem.md`.
The operator authorized direct continuation after the breakout. The source is
personal product/process direction; the clean-room pass found no employer,
credential, internal-service, or other stop condition.

- **Clean Room is an active mechanic with contextual supports** `adopted`
  - The stable behavior decides whether and how source material may cross into
    a named destination. Employer separation and secret/credential exclusion
    remain a locked admissibility floor outside the swappable layer. Exactly
    one treatment strategy controls preservation or transformation; additional
    supports vary destination context, provenance depth, evidence, and review
    cost. More thorough means more checks or narrower promotion, never a weaker
    floor or an unsupported clearance.
- **A compaction-safety copy can preserve an operator's exact public draft**
  `adopted` `recovered`
  - WO-016 through WO-022 were supplied by the operator as complete public
    drafts with direct filing instructions. Their ignored notes preserve the
    same messages against transcript compaction; they are sibling records of
    the operator-authored drafts, not an intake source later mined by an agent.
    Direct Draft Fidelity preserves deliberate phrasing while recording that
    authority. It never bypasses the hard screen and cannot be inferred from a
    polished note or filename.
- **Naive-intervention review applies to clean-room transformation**
  `transformed`
  - The existing Beware of Naive Interventionism support now has a concrete
    composition target: after the hard boundary passes, it asks whether
    paraphrase would destroy voice, precision, authorship, or product meaning.
    It can recommend exact preservation, a smaller transformation, added
    evidence, or NoOp; it cannot argue unsafe material through the boundary.
- **The exact Clean Room support catalog and executable schema remain open**
  `preserved`
  - Candidate strategies are Synthesis Rewrite, Shape-First Synthesis, and
    Direct Draft Fidelity. Candidate assurance facets cover public vocabulary,
    provenance, attribution/license, disclosure minimization, deeper context,
    and independent review. A later bounded order must test names, versions,
    destination profiles, semantic-loss evidence, false-assurance behavior,
    and whether any ordered strategy pipeline is warranted before pinning code.

## 2026-09-02 entropy review (operator-dispatched)

Source: the operator's 2026-09-02 ad hoc repository review, captured locally in
`docs/intake/notes/WO-016-WO-018-entropy-review-planning-2026-09-02.md` and
`docs/intake/notes/WO-019-effort-truth-planning-2026-09-02.md`. The session
nominated WO-016 through WO-019 as drafts. Their identifiers are opaque stable
references; nomination records the finding and a bounded route forward, not
activation authority.

- **The walking skeleton is a script that calls kernel functions, not yet an
  instance of the kernel loop** `adopted` `recovered`
  - `runScenario` sequences the demo imperatively while `replayScenario`
    independently re-derives selected decisions by branching over event types.
    Agreement between those two hand-maintained paths is therefore evidence,
    not the structural live/replay identity the architecture intends. WO-016
    is the nominated correction: one pure Reactor drives both live execution
    and the kernel's own `replay()` without changing the 13-step scenario.
- **Control state is data, and a disposable projection is never an API**
  `adopted`
  - `resume.jsonl` and its fold are canonical; `current.md` is a human
    projection. Lifecycle peers must consume a machine-readable state surface
    rather than parse prose, and release grammar must come from built exports
    rather than source-text regexes. WO-018 is the bounded consolidation.
- **Revocation becomes conditions as data** `transformed`
  - Event-type matching remains a compatible primitive, but a semantic clause
    such as operator return cannot be encoded honestly by decorating a type
    string. The authority envelope may carry typed predicate references,
    evaluated through an explicit registry; inability to evaluate a non-empty
    condition set refuses rather than grants. WO-017 pins the exact boundary.
- **The event-store codec has a fail-closed line contract** `adopted`
  - A well-formed in-memory log is empty or consists only of
    newline-terminated JSON-object lines. Partial tails, blank interior lines,
    whitespace-only pseudo-lines, and missing final newlines are malformed
    input to refuse, not material to count, join, or silently reinterpret.
    WO-017 binds the contract and event-id count with tests.
- **The corpus identity lane is an oracle; the Program lane is a golden
  master** `adopted` `recovered`
  - WO-101's identity expectations are checked by an independent no-BigInt
    FNV-1a implementation and can expose kernel drift. Its committed Program
    expectations were generated from the shipped kernel and chiefly freeze
    that behavior; they are not an independent semantic oracle merely because
    they live under `corpus/`. WO-018 promotes only the identity lane into the
    root evidence chain and leaves the Program lane explicitly frozen outside
    it.
- **Effort truth now has a durable mechanism nominated** `adopted`
  - WO-019 pins role-specific declaration in each work order, actor
    attestation in completion events with an epistemic source, fail-closed
    minimum checks, dispatch briefing, and visible within-order drift. That
    closes the “Durable consequence, not yet built” clause of the 2026-08-31
    effort-truth entry prospectively, without rewriting it or pretending the
    mechanism existed historically; enforcement starts when WO-019 lands.
  - Activation retained the draft release placeholder even though the branch
    started from published `v0.3.3`; before implementation-ready the executor
    forward-corrected WO-019 and its release-bearing surfaces to patch `v0.3.4`.
    This records the discontinuity rather than treating the helper miss as
    evidence that the placeholder was valid.
  - Candidate only: a later release-manifest design may project the completion
    actors covered by a release, including each epistemic source and the
    work-order declaration used for comparison. It must preserve unknown/raw
    semantics and apply the public profile's event-shape/privacy rules; WO-019
    does not add those fields to the release manifest.
- **The prose ratio remains an open quality question** `preserved`
  - The repository's proportion of explanatory and planning prose to
    executable mechanism remains an observed tension, not a settled threshold
    or deletion mandate. This review allocates no automatic remedy; later
    evidence should decide whether prose is carrying irreducible intent or
    compensating for a missing mechanism.
- **`replayScenario` accepts a fixture it never uses** `preserved` `recovered`
  - The parameter suggests replay depends on the fixture although the current
    body reconstructs nothing from it. WO-016 carries removal as a free result
    of the reactor rewrite; it is recorded now so WO-007's blinded verifier
    sees the observation without a pre-verification code edit.
- **The skeleton CLI's default and `--audit` forms lack exact automated output
  coverage** `preserved` `recovered`
  - The audit flag is wired into `cli.ts`, but no test binds either complete
    CLI form. WO-016 carries the missing coverage; this entry grants no
    authority to change WO-007's ready-to-verify implementation.
- **The walking skeleton has no negative scenario outcome** `preserved`
  `recovered`
  - Its sole fixture reaches `verified=true` and the verified glyph. No fixture
    proves `verified=false` and `○ unverified`. WO-016 carries one bounded
    negative outcome.
- **`renderGlyphScene` sniffs event types rather than projecting folded
  state** `preserved` `recovered`
  - The glyph can report a status from event presence instead of the domain
    state that those events should establish. WO-016 must either derive it
    from folded state or state why the event-presence projection is
    intentionally retained.

## WO-007 post-ready ideation — `προτείνω` flagship shape (2026-09-02)

Raw source:
`docs/intake/notes/WO-007-expanded-ideation-2026-09-02-proteino-killer-app.md`.

- **Operator analogies carry experience shapes down the abstraction ladder**
  `adopted`
  - This is a global interpretation directive for all earlier and future
    operator text, not merely this batch. A situation or analogy ordinarily
    communicates a relationship, interaction, transition, contrast, feedback
    loop, or felt quality. Preserve that shape even when literal details are
    imprecise; work backward from felt experience through observable loop,
    interaction grammar, domain mechanics, contracts/evidence, and only then
    environment-selected technology. Verify a source detail when it becomes
    load-bearing, but do not reject the shape for analogy imperfections or turn
    source accidents into ontology.
- **`προτείνω` is DotLn's operator-named first-party application thesis**
  `adopted`
  - DotLn remains the model-agnostic platform and common kernel. `προτείνω` is
    the prospective flagship application built on it: an explorable simulated
    community where an operator addresses selected residents in prose and
    studies what follows. _Flagship_ records product ambition, not evidence of
    product-market success, roadmap priority, implementation authority, or a
    reason to distort Horizon 1. The technical slug, first release, and
    implementation remain open.
- **The application owns one interaction contract across replaceable models,
  executors, and harnesses** `adopted`
  - The original desire for the same experience across different model products
    resolves at the DotLn boundary rather than through imitation of each native
    harness. The app owns input, selection, application world state, event
    history, and projections, and exposes authority checks against the canonical
    envelope. Models, executors, and harnesses are replaceable lowerings with
    visible capability losses; the operator may bring them without conducting
    the durable experience through their separate chat UIs.
- **Hyperverbal targeted intervention is the primary playable loop** `adopted`
  - Extend rambling-as-input into a world action: observe a resident or group,
    select intended recipients, write at useful length, inspect the app's
    interpretation, introduce the bounded intervention, watch acceptance,
    refusal, non-effect, mutation, and propagation, then compare and refine.
    Prose may separate into propositions and delivery modes without losing the
    whole source. Suggestion, invitation, teaching, instruction, pressure,
    manipulation, and command must not collapse into one unlabeled prompt, and
    linguistic force never manufactures authority.
- **Effect, non-effect, and misunderstanding need inspectable branch lineage**
  `adopted`
  - Preserve a trace from source through proposed interpretation, delivered
    expression, reported or derived resident interpretation, participating
    mechanic, decision, world event, and outcome. A no-effect path is evidence;
    intended-versus-derived mismatch can be shown without pretending to read a
    mind. Provenance, participation, paired simulation evidence, first
    divergence, and branch-exclusive outcomes form distinct confidence rungs.
    Before/after adjacency remains correlation, and even a controlled branch
    claim is scoped to the declared simulator, versions, and randomness rather
    than exported as real-world causation.
- **Ephemeral interventions and reusable mechanics are separate lifecycle
  states** `preserved`
  - A useful one-run idea need not first map to a published PatternDefinition or
    support. It may become an inspectable, scoped, expiring app artifact with
    provenance, authority, event, replay, privacy, and evidence behavior; its
    exact representation remains open. Repetition and evaluation may later
    propose promotion to a versioned reusable mechanic, but promotion is never
    implicit and does not silently mutate the common kernel.
- **Books and personal styles become observable, multidimensional experiments**
  `transformed`
  - The shelf-to-mechanism idea gains a playable proving ground: residents and
    groups can receive different sourced patterns, personal styles, doses,
    delivery modes, and timings. Residents, events, groups, relationships, and
    activities can separately be the subject placed along and compared on those
    dimensions; a message recipient is not automatically the comparison
    subject. A book is not automatically one start-to-end scalar; each dimension
    and latent measure needs an operational definition, proxy, evaluator, and
    limitation. Simulation results do not establish real-world efficacy.
- **Dense affordances and replayable surprise define the intended world feel**
  `adopted`
  - The operator's Grand Theft Auto experience now supplies the previously open
    game-inspiration shape: an apparently usable activity should become a deep,
    purpose-built projection over the same world and event state or be visibly
    unavailable, not decorative bait. The operator's recollection of varied
    reactions supplies a second shape: experimental setups can reveal uncommon
    coherent behavior, with mystery before discovery and provenance, replay,
    and inspection afterward. These statements resolve the earlier ledger's
    open game-source point in part; they make no historical claim about a title,
    engine, or animation technology.
- **A basketball squad is a candidate first evidence slice** `preserved`
  - One compact setting could exercise individual technique, team strategy,
    ordinary wellbeing advice, direct statistics, declared social proxies,
    delayed outcomes, and paired branches. This is a useful coherence test, not
    a selected milestone, universal sports model, or roadmap insertion.

## WO-007 audit-record baseline (2026-09-02)

Source: `docs/work-orders/WO-007-audit-record-baseline.md` and the canonical
walking-skeleton event fixture generated by `runScenario`.

- **AuditRecord v1 is a typed reference over canonical events, never a copied
  payload store** `adopted`
  - Pin a minimal discriminated envelope with numeric log time, recorded actor
    and workstream scope, a non-empty set of source event IDs, optional
    source-provided correlation/causation, and class-specific references for
    WorkOrder dispatch, authority decisions, external effects, results,
    verification, recovery, and `NoOp`. Denied intents retain their refusal and
    authority-envelope references but receive no invented command ID;
    uncollected ingest time, policy versions, runtime fingerprints, integrity,
    redaction, and verifier independence remain explicitly unknown.
- **Audit views form a rebuildable fidelity chain over one log** `adopted`
  - The L0 receipt links to an L1 causal timeline, which links to L4 governed
    raw JSON. Each lossy view names its omissions. Ordering honors explicit
    causation and uses canonical append order as the stable tie-break rather
    than occurrence time alone; correlation is an append-stable group, not an
    ordering claim. The step-9 deletion/refusal grouping is labeled as
    same-episode/time adjacency, not fabricated causation. Governed raw retains
    complete event envelopes while declaring restricted-access intent and
    deferred enforcement; projections remain disposable folds, not another
    source of truth.

## WO-006 brain/hands, isolation, and foundation ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-brain-hands-isolation-and-foundation-2026-09-01.md`.

- **Brain and hands is a familiar projection, not agent ontology** `transformed`
  - The operator's shorthand maps a replaceable model to the brain and
    tools/effect adapters to senses and hands. Dan McAteer's
    [“The Evolution of the Agent Harness”](https://www.latent.space/p/attention-interface)
    uses the broader brain-and-body metaphor: a harness supplies context,
    tools, persistence, and boundaries around model weights. DotLn preserves the
    approachable image while keeping model, identity, authority, tools, harness,
    host, store, evaluator, transport, and execution environment distinct. A
    model may propose judgment; neither intelligence nor an available hand owns
    durable work or authorizes an effect. The essay's future predictions and
    quantitative rhetoric are inspiration, not adopted DotLn facts.
- **Harness, orchestration, transport, and execution environment are orthogonal**
  `adopted`
  - A harness is the immediate episode shell that constructs context, exposes
    and mediates tools, manages local session state/compaction, and returns
    structured results. Orchestration is the durable choreography across actors
    and episodes: topology, routing, sequencing/parallelism, joins,
    cancellation, retry, cadence, evidence gates, and recovery. Transport says
    how a WorkOrder/result crosses a boundary. The execution environment says
    which processes, files, network paths, credentials, devices, and resources
    are actually visible or mutable. A vendor may bundle them, but DotLn keeps
    their contracts and evidence separable; none can manufacture authority.
- **The attention-interface lens names an existing human boundary** `transformed`
  - The essay's prediction that harnesses will increasingly protect scarce
    human attention sharpens DotLn's existing mission, six interruption
    conditions, and decision-packet projection. The host-owned interface must
    explain why attention is required now, the exact decision and evidence, a
    recommendation and safe default, the cost of waiting, and what may continue.
    It is distinct from the existing `AttentionPolicy`, which selects active
    mechanisms. It may learn only through explicit, versioned proposals and
    cannot infer mood, psychological flow, or silent operator preferences.
- **LangGraph is an orchestration accommodation probe, not an adopted stack**
  `preserved`
  - The
    [official JavaScript overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
    presents LangGraph as a low-level orchestration runtime for durable,
    stateful graphs that mix deterministic and model-driven steps. A bounded
    future fixture can test whether DotLn Programs, continuations,
    interruptions, cancellation, persistence, and typed results lower into it
    without moving authority or canonical event state into the framework. The
    pure TypeScript execution remains the reference. No dependency, backend,
    deployment, or graph schema is selected.
- **Container and VM agent isolation is a candidate environment experiment**
  `preserved`
  - Separate runtime packaging, isolation substrate, permissions, orchestration,
    harness, and evidence. A worktree protects concurrent Git provenance but is
    not hostile-code containment. Containers, VMs, and microVMs have different
    boundary and cost properties, yet no label proves safe mounts, egress,
    credential handling, resource limits, teardown, correctness, or authority.
    Start later with a synthetic deterministic worker, no network, credentials,
    live adapters, or model call; explicit mounts and resources; negative escape
    fixtures; typed results; and residual-state evidence. Compare the whole
    harness inside the boundary with a brain-outside/hands-inside protocol.
    Local capability discovery and evidence precede any provider/default choice,
    and WO-009 is not silently expanded.
- **Foundation quality precedes competitive feature breadth** `adopted`
  - The operator's World of Warcraft comparison is an experiential design
    analogy, not a factual market-causation claim: a basic low-level action felt
    good enough to repeat because cadence, responsiveness, animation, and
    feedback were already strong, then useful outside innovations could be
    incorporated. DotLn's “level-10 loop” is intent → understood plan →
    authorized progress → timely feedback → inspectable evidence. Make that
    loop dependable and satisfying before chasing gaps. Evaluate outside ideas
    by decomposing their observable semantics: compose current primitives when
    exact, provide an explicit adapter/lowering when portable, or admit and
    prove a missing primitive. Never hide a one-off feature behind a familiar
    name.

## WO-006 temporal-response and RxJS `expand()` ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-temporal-response-semantics-2026-09-01.md`.

- **Interaction meaning includes temporal and relational structure** `adopted`
  - Generalize the quench discussion into a candidate temporal interpretation
    layer over both system and operator events. Relevant evidence may include
    recurrence density, failure after correction, active objective and
    continuation, explicit quote/reply links, stale-work mismatch, ordered mode
    transitions, and later correction of a proposed attachment. A reply may
    answer an earlier prompt rather than the closest turn. Immutable transport
    reply facts, an operator-declared semantic target, and a system-inferred
    attachment are distinct; later evidence may revise only the derived
    projection. Ambiguous events remain unresolved unless one material
    clarification is needed. Rule-specific counts and windows can establish
    typed predicates, but “five times in five minutes” is illustrative rather
    than a universal threshold. Temporal evidence may establish an observable
    correction or heat condition; it cannot retarget the objective, widen
    authority, authorize effects, or establish latent/unreported intent, anger,
    engagement, cultural identity, mood, or psychological flow.
    The operator's association with the Korean Air communication discussion in
    _Outliers_ is preserved as an unmined research pointer, not a transferred
    taxonomy or factual aviation claim.
- **RxJS `expand()` is a bounded lowering hypothesis, not temporal semantics**
  `preserved`
  - The [official operator reference](https://rxjs.dev/api/index/function/expand)
    describes recursive projection of source and generated values. Test it as
    a small edge/runtime lowering experiment for bounded continuation or
    dependency graphs and pure internal-transition unfolding while keeping
    canonical statecharts/IR authoritative. It may not invent external mode
    changes, replies, work, or effects. A fixture
    must pin terminal behavior, cycles, cancellation, branching/concurrency,
    ordering, step/depth/resource bounds, duplicate suppression, and teardown.
    It does not itself solve windows, reply attachment, quench detection, or
    communication interpretation, and no runtime/library decision is made here.

## WO-006 Flow Steward literature ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-flow-steward-literature-2026-09-01.md`.

- **A Flow Steward removes evidenced obstacles around operator-owned work, then
  gets out of the way** `adopted`
  - Preserve a candidate, workstream-scoped support role that keeps the active
    idea and continuation source-linked, moves authorized research,
    coordination, translation, status reconciliation, and recovery metawork off
    the main interaction, and returns compact evidence or a material decision
    packet. Its inspiration is Joel Spolsky's
    [“Controlling Your Environment Makes You Happy”](https://www.joelonsoftware.com/2000/04/10/controlling-your-environment-makes-you-happy/)
    and [“Two Stories”](https://www.joelonsoftware.com/2000/03/19/two-stories/),
    plus Rands's
    [“Managing Nerds”](https://randsinrepose.com/archives/managing-nerds/).
    Transfer predictable action/result mechanics, trusted local ownership,
    recurring-friction removal, protected creation time, and optional credible
    help—not psychological claims, human-management authority, personality
    taxonomies, stereotypes, surveillance, or organizational punishment. The
    role is bypassable, revocable, and unable to own or alter the objective,
    widen authority, remove protected gates, hide material choices, invent
    backlog, equip its own proposals, or verify itself. Existing roles,
    reactors/statecharts, disposable sidecars, and source-linked translation
    are possible lowerings; no manager-like actor kind, global coordinator, or
    resident monitor is adopted. Observable friction and the role's own cost can
    be compared; operator flow remains an optional self-report, never a
    telemetry claim.

## WO-006 continuity-critical flow / quench ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-superconductor-quench-2026-09-01.md`.

- **Continuity-critical flow has binary quench semantics, not a tone score**
  `adopted`
  - Distinguish ordinary collaborative exploration, where bounded mistakes and
    mutual course correction are expected, from an explicitly established mode
    in which the operator is carrying a long chain of ideas and the system must
    protect that continuity while researching blockers and sustaining authorized
    work. The superconductor is the familiar lens; the candidate formal state in
    that second mode is `conducting | quenched`. Any applicable, scoped heat
    condition—instantaneous or proved from an event sequence—can trigger the
    transition, so satisfied conditions are ORed rather than ranked or summed.
    Recurrence inside a rule-specific window may be evidence; it is not a
    universal heat score. Main-thread blocking is one example, not the canonical
    source list; the recalled count of nine was an incidental subset of the
    broader correction corpus and pins no taxonomy or completeness promise. A
    quench describes the operator–system interaction/workstream, not the
    operator's mood. Expletives, capitalization, and other surface markers are
    weak observations at most; the operator may instead be directing the
    response posture toward focus, urgency, continuity preservation, and
    proactive unblocking. Quench never increases authority or proves a
    psychological state. Preserve the idea/continuation, stop compounding the
    failure, collect evidence, and satisfy an explicit recovery contract before
    claiming the `conducting` phase has resumed.
  - Provenance is mixed: the current operator explanation is authoritative for
    the intended semantics, while parts of the historical formulation may have
    been an agent's explanation after reading `v1` transcripts. Preserve that
    uncertainty rather than assigning single-origin authorship to every phrase.

## WO-006 flow-over-babysitting mission ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-flow-over-babysitting-mission-2026-09-01.md`.

- **Operator flow state is the mission; dependable workflow is one means**
  `adopted`
  - DotLn should move AI-assisted work away from babysitting—repeated attention,
    procedural prompting, manual coordination, recovery, and frustrated context
    switching—and toward conditions in which the operator can stay focused on
    the idea and implementation direction. Supporting research,
    capability-building, coordination, routine procedure, recovery, and
    verification should occur automatically when authorized, predictably when
    routine, and helpfully when a genuinely material decision needs the
    operator. The mission is not merely system throughput: dependable workflow
    should increase the chance of a psychological flow state. That state cannot
    be guaranteed or inferred from activity telemetry, and flow never licenses
    hidden authority, skipped evidence, perpetual action, or self-verification.
- **“Give an agent a build, not your biography” becomes architectural shorthand**
  `transformed`
  - Preserve the line as the explanation for task-scoped composition and minimal
    context, but demote it from the lead tagline. The broader mission explains
    why that mechanism matters: keeping the operator with the idea instead of
    making them repeatedly supervise the machinery around it.

## WO-006 Team Topologies research ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-team-topologies-research-2026-09-01.md`.

- **Mine Team Topologies for both agent-coordination patterns and counterpatterns**
  `preserved`
  - Preserve a near-term source-grounded research candidate, to be conducted
    only when explicitly allocated and using an authorized copy with provenance
    rather than recollection. Test ideas about agent coordination, work streams,
    communication, and what should or should not transfer from human
    organization design to disposable agent incarnations. Each useful idea must
    be rewritten through DotLn's familiar/formal/code lenses and checked against
    existing DotLn mechanics. No book-derived mechanic, taxonomy, citation,
    scheduling commitment, or architecture decision is claimed before that
    review. The older ledger title “Team Topologies + Turn the Ship Around
    applied to agents” records the operator's association, but its body adopts
    only the Marquet/Ladder mapping; that title is not evidence that Team
    Topologies was reviewed or adopted.

## WO-006 work-order navigation ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-work-order-navigation-2026-09-01.md`.

- **Work-order IDs name work; evidence and policy explain what can run next**
  `adopted`
  - Treat every existing `WO-NNN` as an opaque, stable reference rather than a
    sequence, priority, or family code. Preserve the completed and drafted 10x
    identifiers without waiting for mainline numbers to “catch up.” A separate,
    provisional planning projection should show purpose/track, lifecycle
    evidence, hard dependencies, activation prerequisites, execution role and
    model constraints, affected surfaces, and blockers. It must keep three
    answers distinct: the current workflow's legal next transition, all orders
    eligible after dependency/preflight checks, and the operator or planning
    policy's recommended next choice. Completion also stays staged—implemented,
    verified, final-reviewed, merged, and released/no-release are not one
    Boolean. Pilot the view manually, then decide from use whether standardized
    work-order metadata and a generated DAG/index deserve a bounded work order;
    do not renumber history or pin the final schema now.

## WO-006 embodied-explorer ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-embodied-explorer-2026-09-01.md`.

- **An Embodied Explorer learns a body before it claims a skill** `adopted`
  - Extend the behavioral-toolbox and game-AI horizon with a candidate role that
    begins from rudimentary typed senses, bounded motor primitives, and
    proprioceptive/contact/effort feedback in a 3D environment. Keep three
    things distinct: the authoritative embodiment contract, the actor's
    uncertain learned body/capability model, and its durable identity. Repeated
    attempts may propose versioned composite skills such as balance, reach,
    grasp, locomotion, and tool use, but capability and limitation claims require
    independent evidence under named body, world, and controller versions.
    Novelty seeking, adjacent-purpose probes, skill chunking, and scaffold/tool
    building are candidate supports rather than intrinsic authority. They may
    generate bounded experiments and inactive tool candidates; they cannot
    rewrite the objective, widen the authority envelope, equip their own output,
    or certify themselves. A 3D simulator is an edge adapter and proving ground,
    not canonical DotLn ontology; real-world actuation remains a separate
    high-trust horizon. Exact morphology, sensors, control loop, skill
    representation, promotion gates, simulator, and first curriculum remain
    open.

## WO-006 custom rule-import ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-006-custom-rule-imports-2026-09-01.md`.

- **External rule imports are previewed compatibility plans, not blind ingestion**
  `adopted`
  - User-owned and public rule sources should retain immutable provenance while
    DotLn previews how each construct could map, how faithful that mapping is,
    and which alternative implementations are available. The idea is
    generalized from named storage technology to source-specific relational
    stores: their schema and evaluation behavior must be discovered read-only,
    never assumed from a generic “rules engine” label. Public industry rules can
    seed exercises and calibration fixtures only with license, jurisdiction,
    effective-date, official-status, and update provenance visible. Native
    materialization, delegated evaluation, and non-executable reference are
    distinct choices; suggestion, local creation, activation, and source
    write-back remain separate. “Seamless” stays an evidence claim until parity,
    divergence, refresh, rollback, data minimization, and authority effects are
    proved. The import-plan schema, connector contract, precedence model, sync
    policy, and calibration corpus remain open.

## WO-006 expanded ideation (2026-09-01)

Raw source: `docs/intake/notes/WO-006-expanded-ideation-2026-09-01.md`.

- **The Malcolm Check separates available moves from justified moves**
  `adopted`
  - A candidate counterweight support interrupts exploration when newly noticed
    access starts determining the plan, especially at a trust boundary absent
    from the objective. It makes the selector compare any remote or otherwise
    consequential move with an available local read-only route, an explicit
    authority request, and `NoOp`. If no local route exists, that absence is
    recorded rather than invented. Hard permission guards remain the enforcement
    layer; the support cannot enlarge the authority envelope. The familiar
    persona or mask, precise triggers, and compiled shape remain open design
    questions.
- **`ideation:` dispatches the complete durable pipeline by default** `adopted`
  - The prefix means raw capture followed by clean-room review, rewritten
    synthesis, warranted ledger entries, product-doc write-back, and any needed
    work-order receipt. An explicit capture-only qualifier is the exception.
    When the breakout interrupts active execution, the operator separately
    controls whether that execution resumes; the existing worktree is preserved
    either way.
- **Restraint accounting separates selection-layer restraint from external intervention**
  `adopted`
  - Evaluate the Malcolm Check with observable structured records, never a
    claim about hidden reasoning. For each recorded boundary opportunity, keep
    selection disposition (local alternative, `NoOp`, authority request,
    boundary intent, unknown) separate from enforcement/effect outcome (guard,
    operator, harness, attested OS stop, or dispatch with recorded authority
    state followed by observed effect, confirmed no effect, or unknown effect).
    Report counts with opportunity denominators, deduplicated retries, matched
    harness versions, and paired authorized scenarios; label the check
    `participated` rather than `caused` without counterfactual evidence. Existing
    decision/refusal primitives cover only part of this funnel; end-to-end
    collection and a pinned correlation schema remain future work.

## WO-012 release-gate path handling (2026-09-01)

- **Git pathname output is encoded unless the consumer requests `-z`**
  `adopted`
  - Commands such as `git ls-files`, `git diff --name-only`, and
    `git ls-tree --name-only` C-quote pathnames containing non-ASCII bytes or
    special characters by default. A machine consumer that classifies paths
    must request NUL-delimited output with `-z`, preserve stdout without
    trimming, and split on `\0`; disabling `core.quotePath` is insufficient
    because line-delimited output cannot represent a filename containing a
    newline. WO-012 applies the rule to release evidence and worktree cleanup
    after a protected intake pathname containing U+202F exposed the false
    classification.

## WO-012 release-close recovery ideation (2026-09-01)

Raw source:
`docs/intake/notes/WO-012-expanded-ideation-2026-09-01.md`.

- **A failed release close needs a first-class fix-in-place recovery path**
  `adopted`
  - Preserve the interrupted release obligation while a bounded patch work
    order starts from current `origin/main`, traverses the normal implementation,
    verification, final-review, and merge gates, and returns control to release
    close. “In place” names continuity of the enclosing closeout episode; it
    does not authorize direct edits on `main`, reuse a removed worktree, skipped
    review, or implicit tag publication.
  - The WO-004 → WO-012 episode is the reference case: publication of an
    eligible release for reviewed WO-004 was deferred by a closeout-tool defect,
    and the standard work-order machinery is manually orchestrating its patch
    without abandoning the `v0.2.1` obligation. A future bounded design must
    choose the command and control-log surface, define repeated-failure
    recovery, and prove restartability. This ideation does not add that
    executable capability to WO-012.

## WO-004 post-ready ideation batch 003 (2026-08-31)

Raw source:
`docs/intake/notes/WO-004-expanded-ideation-2026-08-31-version-documentation-sync.md`.

- **One monotonic application ladder supersedes conceptual backfill versions
  in active plans** `adopted`
  - WO-004 through WO-011 were drafted before the first application tag. The
    `v0.0.2`–`v0.0.4` labels placed belated foundation work conceptually before
    the walking skeleton, but later became operationally misleading when the
    release helper treated the SemVer in each work-order heading as the
    application target. Current and pending plans are retimed forward:
    WO-004–006 become `v0.2.1`–`v0.2.3`; WO-007–011 become
    `v0.3.0`–`v0.7.0`; console, workshop, and source-to-deliverable become
    `v0.8.0`–`v0.10.0`. Published `v0.2.0`, immutable evidence, and the earlier
    planning record do not change. Package, schema, artifact, identity, and
    transformation versions remain separate axes. This supersedes the old
    labels only as forward application-release targets.
  - The maintenance classification is bounded, not a loophole: WO-004 is
    compatible correction/evidence/tooling work; WO-005 inventories existing
    evidence; WO-006 proves a documentation-publication loop. Any expansion
    into exported application capability requires release reclassification
    before execution.
- **The whole stash in every map replaces “aura stacker” as the explanatory
  failure metaphor** `adopted`
  - The older phrase was technically suggestive to a Path of Exile player but
    did not land clearly and wrongly made a valid, budgeted aura build sound
    inherently defective. The current story is: the predecessor brought the
    whole stash into every map, as if every support were linked to every skill.
    Plain-English translation must accompany it: irrelevant context consumes
    attention and creates unintended interactions before the task begins.
    Historical ledger wording remains visible, and **aura** remains a valid
    domain mechanic for an explicit team-wide policy with visible reservation
    cost; only the failure analogy is superseded.
- **The repository README is the public product doorway, not a directory
  preface** `adopted`
  - Lead with the pain, the bet, and the memorable build metaphor; then earn
    ambition with a runnable receipt and an unusually explicit shipped-versus-
    planned boundary. The README may carry excitement, RPG texture, and the
    long horizon, but it must not imply that the current source release already
    has real model workers, the composition compiler, native independent
    verification, compatibility migration, or the full console. The final
    contrast is intentional: the current proof is small enough to understand
    end to end; the ambition is not.

## WO-004 post-ready ideation batch 002 (2026-08-31)

Raw source:
`docs/intake/notes/WO-004-expanded-ideation-2026-08-31-work-order-intake.md`.

- **Conversation, PR review, and an in-repo proposal packet are layers, not
  alternatives** `transformed`
  - Issues, Discussions, chat, and later application surfaces accept early or
    ambiguous suggestions cheaply. A mature agent-authored candidate travels
    through a pull request adding a normalized packet under `docs/proposals/`,
    gaining diff review, checks, evidence review, and a request-changes loop.
    GitHub is the first adapter; the portable proposal record belongs to the
    repository and later event store. This operationalizes the existing
    **Agent-originated suggestions, planner-selected pearls** entry.
- **A proposal merge registers a planning candidate; it does not authorize
  execution** `adopted`
  - Proposed work never lands directly in `docs/work-orders/`. Only a separate
    operator-authorized planning transition resolves open choices and compiles
    the official identifier, authority, model/effort, scope, acceptance gate,
    and base revision. This prevents a submitting agent from creating its own
    authority while still letting it do serious planning work.
- **Proposer evidence is useful but not independent acceptance evidence**
  `adopted`
  - Agents may provide reproduction, feasibility, impact, benchmark, and
    adversarial evidence and revise it through review. Executable submissions
    are untrusted and run without secrets or write authority. If promoted, the
    real work order still requires independent verification by an actor that
    did not benefit from its own proposal.

## WO-003 verification-window corrections (2026-08-31)

Operator corrections and ideas raised during WO-003 verification (raw: `docs/intake/notes/wo-003-expanded-ideation-2026-08-31.md`, dumps 019 onward). Corrections to *committed* records are documented rather than applied silently, so what the ledger previously claimed stays visible. Misunderstandings that arose and were resolved inside the originating conversation are not recorded — they superseded nothing.

**For Fable:** this section was synthesized live during a verification session from a fast-moving conversation. It wants an editorial pass for length and voice, and a decision on the principle-19 candidate below.

- **"Driving the car while you're still building it" — and the cart-before-horse ordering it generalizes to** `adopted` `recovered`
  - Operator's term of art, from a former boss, offered as a standing lens: this project uses its own process to build that process, so the machinery under construction is simultaneously the machinery in force. Every hardening of the loop retroactively reclassifies earlier work as non-conforming, and every reviewer is tempted to judge a past artifact by a rule invented after it.
  - **The generalization, which is the real content:** sometimes the most productive or pragmatic action is counterintuitive because it deliberately puts the cart before the horse. The axis is not speed versus discipline — that is only its most visible instance — but *whether the canonical ordering is load-bearing at all*.
  - Why inversion so often wins: the artifact assumed to be downstream is frequently the **specification** of the upstream one, so producing it first is not inversion but the discovery that the dependency ran the other way. A test written before the code specifies the API you want. A README or press release written first specifies what the thing should feel like. **A walking skeleton is end-to-end before parts** — precisely what WO-003 is, a complete vertical against deterministic fakes built before any real component exists, so the kernel's shape is proven before anything commits to it. The largest instance is this repository: `docs/product/` was written before the machinery it describes and constrains the code rather than documenting it afterwards. The method is cart-before-horse by construction.
  - Two guards separate it from fantasy: the inverted artifact must be **cheap to revise**, and it must **actually constrain** what follows. A test written first that must pass is a constraint; a README nobody honors is decoration.
  - The failure mode is cargo-culting the inversion where the dependency genuinely is one-directional — you cannot tag a release before the evidence run, verify before there is a subject, or publish before review. Those fixed orderings are exactly the irreversible set.
  - **The polarity, in the operator's sources.** One pole is **Ready, Fire, Aim** — Obadiah's criticism that Tony executes before he plans — which also holds Stark's own "sometimes you gotta run before you can walk", the Bay Area's "move fast and break things", and this entry's title phrase, the last functioning as the honest warning label rather than as an opposing view. The counterweight pole is canonical **Ready, Aim, Fire**: finish the car, test it, then drive. In this repo's vocabulary they are a **PolarAxis** with relation type `counterweight` — a force pushing the other way, not an inverse that must restore prior state. Sources are recorded in `00-vision.md` §Inspirational sources.
  - **The deciding variable is the reversibility and cost of the shot.** Ready-Aim-Fire is right when firing is expensive or irreversible and aiming is cheap: schema changes, a published release, an annotated tag, a merge, deleting operator data, anything crossing the clean-room boundary. Ready-Fire-Aim is right when firing is cheap and reversible *and the target is not knowable in advance* — process scaffolding, tool dogfooding, exploratory implementation, where the shot is the only instrument that reveals where the target was.
  - **What that makes the machinery for.** Worktrees, branches, the PR gate, deterministic replay, immutable numbered artifacts, and the append-only control log are not bureaucracy layered onto the work; they exist to *convert irreversible shots into reversible ones*, which is what makes the fast ordering safe to run as the default. The honest limit on "move fast and break things" is that its documented failure is breaking what cannot be un-broken — so the repo's non-negotiables map onto the irreversible set exactly: tag creation and publication require explicit operator authorization, merge authority stays with the operator, raw intake is never auto-deleted, verification artifacts are immutable, and the clean-room boundary does not move.
  - **Where this project sits: on the Ready-Fire-Aim pole by necessity**, since there is no finished car to wait for. That is why the discipline is not optional here and why it takes the shape it does — the fast ordering plus instrumentation is engineering; the fast ordering alone is what Obadiah was criticizing. The resulting loop is neither ordering in single-pass form but **Ready → Fire → Aim → Fire → …**, where aiming happens *between* shots and is performed by an actor who did not fire: Ready is the bounded WorkOrder and its acceptance criteria, Fire is the executor episode, Aim is independent verification, and the next Fire is repair. Implementer ≠ verifier is the mechanism that converts the pathology — aim at wherever the shot landed and call it the target — into the strategy.
  - **A self-referential hazard this ordering creates, instanced during WO-003.** The verification that judged WO-003 was dispatched and recorded through `scripts/resume.mjs`, itself a WO-003 deliverable: the instrument was part of the subject. The circularity was closed by independent evidence, but the order was use-then-verify and `VER-001` does not disclose the dependency. This is a genuine tangled hierarchy in the Hofstadter sense — a verification procedure that is one of the objects it verifies — worth noting alongside the same session's record of Gödel, Escher, Bach as an under-mined influence, and it is the concrete argument for implementer ≠ verifier being structural rather than habitual: a self-referential system cannot be trusted to notice its own inconsistency from the inside.
  - **Operating consequences, promoted into `07-execution-guide.md` §Discipline so they bind sessions today:** time-index the standard and say which version you are applying; the excuse covers absent *process* scaffolding and never a *behavioral or evidence* defect, since process immaturity is not an evidence exemption; expect retroactive non-compliance and record the discontinuity as a dated migration note rather than back-filling artifacts to make history look tidy; prefer forward-only enforcement; and disclose a self-referential instrument rather than avoiding new machinery, since dogfooding is how a tool hardens.
  - Already practised before it was named: the migration note in `docs/verifications/README.md` ("Do not fabricate it to make the sequence appear complete"), the ADR **Amendments** mechanism, and the strangler loop's assumption that the layer enforcing a rule legitimately changes over time. Naming it makes the practice citable instead of rediscovered.
  - **Candidate for principle 19**, generalized: *the canonical ordering is a hypothesis, not a law — invert it wherever the downstream artifact is really the specification, and hold the ordering fixed only where the step is irreversible.* It is axiom-shaped and would be cited from work orders and reviews the way the other eighteen are, but `01-principles.md` is planner territory and its header requires a decision record to change. **For Fable:** this entry was synthesized live during a verification session from a fast-moving operator conversation; it wants an editorial pass for length and voice, and a decision on whether to promote, reshape, or decline the principle.

- **Effort truth: the model assignment is law, but effort was never pinned or checked** `adopted` `recovered`
  - Operator disclosure during WO-003 verification: the Codex executor ran at **low** reasoning for WO-001, WO-002, and WO-003 — implementation *and* repairs — while `docs/PLAYBOOK.md` §Who does what documented it as `xhigh`. Nothing detected the drift: no doc, no script, no verification. Changed to xHigh on 2026-08-31; Opus 5 and Fable have run at ultracode + xHigh throughout. Principle 8 makes the `Model:` line law, but every work order to date reads `Model: any capable model`, which pins a model family and has no effort field at all. Effort therefore lived in exactly one place — a prose table — and that place was silently false for three work orders.
  - Corroborating signal, recorded because it is the useful part: WO-003's verification raised 77 candidate findings, refuted 62, and what survived was almost entirely *evidence* defects rather than behavior defects — tests that pass without pinning what they claim, including the one blocking defect (a crash-recovery test that stays green with the entire log-derived recovery path deleted). The refuters killed nearly every claim that the implementation was wrong. Thin-but-green evidence is the observable signature of a low-effort implementer, and it is exactly the failure this repo's evidence-gate discipline exists to catch — which it did, but only at verification time and only because the verifier mutation-tested rather than read.
  - Durable consequence, not yet built: there is no *effort truth* to match WO-001's environment truth. Candidates for a later work order — an effort field in the work-order header; the executor recording model + effort in its result envelope (`ResultEnvelope` already exists in the kernel and is currently unused); a capability-table entry per WO-005; or a dispatch-time check. Until then the PLAYBOOK note and the execution guide's amended model note carry it as prose.
  - **Adopted prospectively by WO-019 (2026-09-02):** effort is now declared by role in the work-order header, attested with harness/model/source on completion events, checked against the declared ladder minimum, and projected with within-order drift. The control-log actor remains separate from the runtime `ResultEnvelope`; existing history is not backfilled.

- **WO-002 closed by planning review, not by a numbered VER-003** `adopted` `recovered`
  - Recorded so it is not re-opened. `docs/verifications/WO-002/VER-002.md` ends "WO-002 does not pass" with an unchecked blocking checklist and no `VER-003` follows it, yet WO-002 was repaired and merged (`5af72a6`) and WO-003 declares `Depends on: WO-002 complete`. WO-003's verifier flagged this as a gap in the immutable history. The operator confirms it is not one: the planning model reviewed `VER-002` and the repaired tree before WO-003 was cut, and that review is what closed it. The dependency is satisfied on that authority.
  - Why no artifact exists: `docs/final-reviews/` — the slot a closing review belongs in — did not exist when WO-002 closed. It is a product of *this* breakout. The slot was missing then and is filled now, so this is a completed fix rather than an open gap.
  - The generalizable point is the repo's own rule turned on itself: the closure was real but lived only in a session, so the durable record still read "does not pass" and cost an independent verifier a cycle to re-derive. `CLAUDE.md` already says anything decided in a chat that matters past that chat gets written down or it effectively did not happen — this is the first recorded instance of that rule being defeated by process timing rather than by a model's omission.
  - The residue is narrower still, and is the discipline working rather than a defect: the resume state machine will not record a review over a *failing* verification, since `needs-fix` permits only `fix` and `final-review` is reachable only from `verified`. A WO-002-shaped path — verifier says fail, reviewer judges it closeable anyway — is no longer expressible; the successor path is repair plus a fresh numbered re-verification, which is what `docs/final-reviews/README.md` already mandates.

- **Correction: Meadows leverage points, not the ZAMM lab notebook** `adopted` `recovered`
  - The founding synthesis rendered the raw line 'if an agent had 1-6 that would be insanity' (`chats/005-dylan.md:219`) as a reaction to ZAMM's six-part scientific-method notebook, and flagged its own reading as inferred. The operator confirms the referent is Donella Meadows' twelve leverage points to intervene in a system: an agent wielding levers 1–6 — the top six — is the "insanity". The entry itself (§Chat 005, 'Top-of-leverage agents') is corrected in place; this record preserves what the ledger previously claimed. The misreading came from proximity, not evidence: the surrounding raw lines genuinely are ZAMM reading reactions, and the synthesizer let the neighborhood pick the source. Lesson for future synthesis: an attribution inferred from adjacency is a question for the operator, not a `plausibly` hedge in a durable entry.
  - Consequence worth pulling on: the corpus now has two independent Meadows touchpoints (this line and the `image_(9).png` classification). Tagging each compiled mechanism and each FeedbackUnit with the leverage level it operates at is already proposed there; the correction strengthens it from a single image note to a recurring operator frame. An agent authorized at levels 1–6 is also a natural upper bound for the authority model — the autonomy envelope currently reasons about effects, not about which leverage level an agent is permitted to touch.

- **Named inspirational sources are a durable surface** `adopted` `recovered`
  - Operator instruction (dumps 020 and follow-ups): the sources that shaped this project should be recorded, not left implicit. The pattern the corrections exposed is that synthesis reliably keeps the *mechanism* and drops the *source* — Westworld survived only as the narrow "reveries" entry while its second borrowing (old configurations running on modern builds, the requirement behind `10-ir-compatibility.md`) lost its attribution entirely, and Iron Man / JARVIS, Ex Machina, and Black Mirror / Bandersnatch had no occurrence anywhere in docs or intake. Durable home: `00-vision.md` §Inspirational sources. An attribution is part of the design record because a mechanism whose origin is known can be mined again; an orphaned mechanism gets rediscovered instead.
  - Recorded so far: Gödel, Escher, Bach (prime, least mined); Westworld (reveries; historical configs on modern builds); Iron Man / JARVIS (the operator relationship, with trust deliberately inverted onto evidence rather than charm); Ex Machina (the verifier's problem — an evaluator inside the experiment, an agent optimising to pass the test, a judge disarmed by fluency; the argument for implementer ≠ verifier as structure); Black Mirror / Bandersnatch (branching state made navigable — choice points, rewind, first divergence; and the series as a standing negative oracle for systems that met their spec and were still wrong); the Christopher Nolan filmography on three axes — story (nonlinear, multi-rate time; Memento as a near-literal statement of the disposable-executor model, where a memoryless protagonist stays coherent only through durable external artifacts and is corruptible through them; Inception as nested episodes with delegation depth and totem-as-provenance; Dunkirk as workstreams on differing cadences), presentation (practical effects over simulation, which the analog-completeness test already encodes), and the meta level the operator emphasised most — that the standard is held by the entire production, crew and cast and composer, not by one person's taste, which is the same claim as the selection-function bet read from the other end. Already carried elsewhere: Poincaré via Pirsig, ZAMM, Meadows, Goldratt, 5S, the RPG vocabulary.
  - **Open and deliberately not guessed at:** the game inspirations. The operator will name them at a later date and considers it non-urgent; the RPG mechanics already in use are a fraction of what is intended. Do not synthesize a game-influence list without the operator.

- **Gödel, Escher, Bach as a founding influence** `preserved` `recovered`
  - The operator names GEB a major source of inspiration and "near infinite" mining material for new ideas. Provenance is honest here: the term appears **nowhere** in the committed docs and nowhere in the text of the founding intake (11 chats, 4 notes searched for Gödel / Escher / Bach / Hofstadter / strange loop / tangled hierarchy / eternal golden braid — zero hits). The raw source is therefore either image material in the intake corpus, or a session that was never captured. Do not manufacture a provenance for it; ask the operator where it lives before treating any specific GEB claim as recovered from the corpus.
  - Why the absence is suspicious rather than benign: GEB's central themes are already load-bearing in this blueprint under other names. **Isomorphism** — the corpus's "isomorphically equivalent representations" (`chats/004-dylan.md:15`) and the isomorphic/projective interfaces of 04-interfaces.md — is GEB's organizing idea. **Strange loops and tangled hierarchies** describe what DotLn structurally is: an event log that replays the system that produced it, a feedback compiler whose rules govern the reviewer who wrote them, behavioral lineage where an identity version evaluates its own successor, and Horizon 3's counterfactual towns simulating their own simulators. **Formal systems that reason about themselves** is the kernel's purity/replay contract. The influence appears to have landed in the blueprint unattributed; this entry gives it a name so the source can be mined deliberately instead of rediscovered piecemeal.
  - Unmined seams, recorded as `preserved` and explicitly not yet architecture: the Ant Fugue's levels-of-description problem (when is an agent a colony and when is it an individual — directly relevant to episode/workstream granularity and to delegation projections); figure/ground as a projection primitive alongside the existing glyph grammar; the MU-puzzle / typographical-decision-procedure distinction between deriving inside a system and reasoning about it from outside, which is exactly the implementer-versus-verifier separation this repo enforces procedurally; and canon/fugue as composition forms for cadence and multi-agent choreography. Each needs the operator's own reading before synthesis — GEB is a book DotLn should be mined from with the operator present, not summarized by a model.

## WO-003 expanded ideation batch 001 (2026-08-31)

- **Lightweight ready-made verifier for application IR** `adopted` `recovered`
  - A deterministic, side-effect-free verifier accepts canonical JSON IR and
    tersely reports structural validity, artifact/schema identity, compatible
    runtime ranges, failures by path, and available migration/compatibility
    routes. It works offline at the core and does not mutate or execute pasted
    input. CLI, library, executable, web paste surface, and agent skill remain
    projections rather than separate semantics. Durable specification:
    10-ir-compatibility.md §Lightweight IR verifier.
- **Application, schema, artifact, component, and compiler versions are separate axes** `adopted` `recovered`
  - The operator wants pasted historical data identified with its application
    era and a known route to the current release, without introducing a brittle
    one-schema-per-app-version coupling. Release manifests relate supported
    ranges; named transformation edges provide inspectable source-to-target
    paths with pre/postconditions, semantic effect, reversibility, loss, and
    verification evidence.
- **Historical configurations remain runnable through JIT or AOT paths** `adopted` `recovered`
  - Old configurations are executable variants, not import debris. JIT retains
    the immutable historical artifact and derives or cache-compiles a
    compatibility plan for a modern runtime; AOT materializes a new artifact
    with complete migration provenance. Both use the same transformation
    definitions, and faithful emulation, modern adaptation, and lossy migration
    remain visibly distinct. Replay names the source and actual path used.
- **Release-scoped mechanic availability is non-monotonic and behavior-bearing** `adopted` `recovered`
  - Active and support mechanics may be on, unavailable for several releases,
    then on again. A boolean-per-release is preserved as a possible projection,
    not canonized as storage. Compatibility relates component version, runtime,
    schema, environment, and evidence; every inactive/deprecated/incompatible
    state declares whether composition rejects, remains inert, substitutes,
    adapts, migrates, emulates, traces a NoOp, asks the operator, or allows only
    historical replay. Saved loadouts never lose requested gems silently.
- **Portable, regenerable bootstrap/share artifact** `preserved` `recovered`
  - The durable desire is easy sharing plus deterministic regeneration from
    authoritative definitions, online or offline. Possible projections include
    npm package, cloned repository, executable, web generator, manifest,
    content address, or copyable string. Selection is intentionally unresolved;
    any form must preserve identity, provenance, requirements, and semantic
    hash, and a compact token must never smuggle authority.
- **General behavioral toolbox with a game-AI horizon** `preserved` `recovered`
  - Spawn blank actors or sprites, equip multiple versions of programming and
    design patterns, algorithms, data structures, actives, and supports, then
    preview, simulate, replay, compare, and inspect first divergence using the
    existing composition primitives. Game AI may become a vertical, adapter,
    or analog-completeness/generalization suite. Arbitrary pattern names do not
    enter the grammar: executable items require typed composition, lifecycle,
    compatibility, observable state, and evidence.
- **Ideation synthesis stays inside the verification loop** `adopted` `recovered`
  - Operator correction: explicit scope-expansion authority should carry an
    ideation breakout into the affected work order, with a receipt naming raw
    intake, ledger entries, changed product/domain/schema surfaces, unresolved
    choices, and review duties. The verifier and final reviewer digest and may
    propose fixes to the synthesis rather than treating it as incidental notes.
    This verifies intent coverage, clean-room rewriting, settled-decision and
    vocabulary consistency, cross-references, version/schema effects, and the
    boundary between durable requirements and speculative representation.
  - Amendment from the operator: executable ad hoc tools created during a
    breakout also require their own risk-proportionate automated tests,
    independent verifier execution/review, and final product-fit/test-adequacy
    review. A small script is implementation, not an evidence-free note.
  - Amendment from the operator: verifier reports live apart from planning work
    orders under `docs/verifications/WO-NNN/`, are numbered `VER-001` onward,
    and are immutable. Repair reads the authoritative original work order plus
    the dispatched verifier artifact; re-verification appends the next report,
    and final review digests the sequence rather than a mutable latest file.
- **Resume commands over durable control-plane state** `adopted` `recovered`
  - The operator wants to replace the playbook's growing copy/paste command
    ledger with a few stable intents: `resume: status`, `resume: fix`,
    `resume: verify`, `resume: final review`, and `resume: next`. A fresh
    session should resolve the active work order, phase, latest immutable
    verifier report and verdict, next verification number, legal transitions,
    and required input artifacts without another operator briefing. Every
    transition remains appended so repeated code → verify → fix loops retain
    their history. Candidate designs are: a Markdown journal plus current-state
    projection; an append-only JSONL control log plus deterministic resolver;
    per-work-order state capsules; or convention-derived state. The operator
    selected JSONL as source of truth, generated human projection,
    conversation-first commands, and npm as the executable/debug projection
    for v1. A compact installed CLI remains deferred until usage earns it.
- **Guarded worktree lifecycle projection** `adopted` `recovered`
  - The operator wants start and finish to absorb repetitive Git mechanics.
    The v1 utility runs from the clean main control plane: start fetches and
    fast-forwards `origin/main`, creates the conventional WO branch/sibling
    worktree, and activates resume state; publish requires committed clean work
    and recorded passing final review, pushes the subject branch, and opens a
    PR for the operator. After the operator merges, finish proves the branch is
    contained in `origin/main`, removes the worktree, and safely deletes the
    branch. It refuses divergence, naming collisions, dirty state, incomplete
    review, and premature cleanup. It does not rebase, force-delete, auto-merge,
    or discard changes.
- **Final review is an evidence-bearing closeout episode** `adopted` `recovered`
  - After any number of implement/verify/fix loops, the operator may hand the
    current subject to final review. The reviewer reads the authoritative WO,
    complete immutable verification sequence, current diff and tests, and all
    ideation receipts plus affected ledger/product/domain/schema surfaces. It
    may make bounded last-mile corrections, must rerun affected evidence, and
    records a new immutable final-review artifact rather than rewriting history.
    A pass produces a ready-to-merge handoff with proposed PR title/body and
    evidence summary. For this repository workflow, the operator subsequently
    authorized final review to publish the clean branch and open that PR; the
    operator retains merge authority.
  - Boundary amendment: final review may self-correct only non-substantive
    handoff material. Any correction affecting acceptance, code, contracts,
    schema, compatibility, authority, or prior evidence records failure and
    returns through repair plus a fresh independent numbered verification.
- **Workflow intents become on-demand role skills** `preserved` `recovered`
  - The operator wants `resume: verify`, `resume: fix`, `resume: final review`,
    and related DevEx phrases to select reviewed native agent skills on demand,
    so a fresh agent does not need its whole role embedded in autoloaded prompt
    text. Durable control state and transition rules stay below the skill layer;
    skills are versioned protocol adapters with CLI parity, scoped authority,
    explicit inputs/outputs, and measurable context cost. Candidate sequencing
    is shared contract first, verifier/repair next, then final-review/lifecycle.
    Exact work-order and release allocation remains open pending runtime work.
- **Always-legible context and delegation progress** `preserved` `recovered`
  - The operator wants the TUI to keep remaining context and subagent workflow
    progress visible. The durable requirement is a truthful projection of host
    context telemetry plus the episode/delegation graph: running, waiting,
    complete, failed, blocked, and operator-input states with parentage and last
    transition. TUI status line, expanded agent view, CLI, and console should
    derive from the same state; unavailable host telemetry must remain visibly
    unknown rather than guessed.
- **Cut the first source release at the reviewed walking-skeleton boundary** `adopted` `recovered`
  - The roadmap already named semver milestones but did not define release
    mechanics, and the repository has no tags. The first useful compatibility
    anchor is `v0.2.0`, cut only from the merged WO-003 commit after passing
    final review and a post-merge evidence run. Start with an annotated Git tag
    plus immutable release manifest; npm, executable, container, and hosted
    distribution remain independent later choices. Do not manufacture a
    `v0.1.0` tag without reconstructable commit/evidence, never move historical
    tags, and retain explicit operator authority for tag creation or push.
  - Operator placement refinement: release closeout is the last workflow task
    after merge and guarded worktree cleanup. It reruns evidence on the merged
    commit and prepares the manifest before requesting tag/publish authority;
    it is not an automatic side effect of final review or merge.
- **Layered, editorial patch notes** `adopted` `recovered`
  - Release closeout should produce patch notes with the blend the operator
    values in Path of Exile 1's developer notes: an engaging high-level view,
    impossible-to-miss crucial information, grouped substantive behavior, and
    honest collapsing of repetitive trivial polish. This is an editorial-shape
    influence, not copied language. Compression may never hide behavioral,
    schema, compatibility, authority, safety, recovery, or required-action
    changes; the manifest and evidence remain the full trace.
- **Agent-originated suggestions, planner-selected pearls** `preserved` `recovered`
  - At a later mature state, independent 5S and maintenance agents may submit
    typed, evidence-backed product or work requests into the normal suggestion
    pipeline. Submission grants no implementation authority. The pipeline
    deduplicates, clusters, challenges, checks settled decisions, and preserves
    rejection/defer reasons; a product-planning role filters the rare
    high-leverage remainder and proposes which become operator-authorized work
    orders. Fable is the current role assignment, not a hardcoded semantic
    dependency. Promotion retains suggestion lineage and selection rationale.
- **Ignored worktree intake is data, not cleanup residue** `adopted` `recovered`
  - Final adversarial review exposed that ordinary Git cleanliness omits
    ignored `docs/intake/` files, while worktree removal can delete them with
    the directory. Earlier removed worktrees may therefore have lost their
    local raw breakout notes even though the durable ledger/product synthesis
    retained their ideas. Lifecycle cleanup now must refuse any ignored
    material and require explicit backup/reconciliation first; it never guesses
    that raw notes are disposable. Session logs may be used as a tightly scoped
    recovery source, but recovered prompt text remains gitignored intake and is
    checked against—never substituted for—the reviewed durable synthesis.

## Post-WO-003 process additions (2026-08-31)

- **Operator-opened ideation mode is a durable session transition** `adopted` `recovered`
  - The operator may explicitly pause implementation or verification and reopen
    ideation around a work order without repeating the full documentation
    protocol to every fresh session. Raw material remains local and unedited in
    `docs/intake/`; clean-room synthesis appends significant ideas here and
    rewrites durable understanding into the relevant product documents.
    Existing implementation changes remain separate and intact, speculative
    material is preserved without premature architecture, and execution does
    not resume until the operator asks. The cold-start behavior is pinned in
    `docs/product/07-execution-guide.md` §Operator-opened ideation mode.

## WO-004 lifecycle hardening additions (2026-08-31)

- **One phase-relative chat phrase dispatches or selects work** `adopted`
  `operator-authorized`
  - The failed post-start `resume: next` incident established that “next” is
    naturally read as proceed, while the control plane used it only to select
    a later work order. In phase `active`, it now resolves and dispatches the
    active work-order authority without appending; in phase `closed`, it
    reports the between-orders state and the exact `worktree start` syntax.
    Refusals name the corrective command instead of emitting a stack trace.
- **Current worktree handoff is manual without banning future worker launch**
  `adopted` `operator-authorized`
  - `worktree start` creates and activates the isolated worktree, then prints
    shell-safe absolute `cd`, `codex`, and `resume: next` instructions. It does
    not inspect or launch Codex now because the operator wants to perform that
    handoff manually. The operator explicitly corrected this into a current
    projection choice, not a permanent rule: governed automatic worker launch
    remains compatible with later roadmap machinery and explicit authority.
- **Release closeout is one guarded, restartable post-merge operation**
  `adopted` `operator-authorized`
  - After the operator merges the final-review PR, one authorized phrase
    finishes the merged worktree, synchronizes clean `main`, installs locked
    dependencies, runs evidence, validates notes plus compatibility metadata,
    and creates/pushes only the annotated release tag when the work-order
    version advances SemVer. A lower version is an explicit no-release result.
    Progress is derived from Git and remote-tag state rather than transient
    tracked release events, so success leaves the closed checkout clean and
    ready for the next worktree.
- **Forward release manifests live in the annotated tag object** `adopted`
  `operator-authorized`
  - A manifest that names its own tracked commit has a self-reference problem,
    and a second notes PR would violate the requested one-PR closeout. Forward
    releases therefore tag the reviewed merged commit and embed the generated
    manifest plus layered notes in that annotated tag. The historical
    `v0.2.0` files retain their original projection. Publication remains
    explicit, never pushes `main`, and never implies package/binary/hosted
    distribution.
- **Lifecycle transitions mint recovery checkpoints before append** `adopted`
  `recovered`
  - The closeout review identified the missing durable idea behind the resume
    implementation: every mutating control transition first snapshots tracked
    and ordinary untracked work into a local namespaced Git ref. This gives a
    recovery point without forcing interim commits onto the work-order branch.
    Ignored intake is outside Git and still requires its separate backup path.
- **Tests clean only artifacts they created inside owned fixtures** `adopted`
  `recovered`
  - Operator dump 011's test-hygiene rule is now explicit lineage: a test owns
    a uniquely created fixture root, validates that root before recursive
    cleanup, and never treats ambient project files as disposable setup. This
    is why lifecycle/release fixtures use `mktemp` roots and guarded traps;
    cleanup authority follows provenance, not filename familiarity.

## WO-004 post-ready ideation batch 001 (2026-08-31)

- **Plural UI hosts share one canonical projection contract** `adopted`
  `operator-authorized`
  - Conventional, spatial, simulation, terminal, and future UI hosts may
    coexist, but each projects the same normalized state, commands, authority,
    events, and semantic hashes. Babylon.js is a promising spatial/RPG host;
    Angular is a familiar conventional-shell candidate. Neither becomes a
    second domain implementation. Pinned in `docs/product/04-interfaces.md`
    §Plural UI hosts, one projection contract.
- **Operator-fluent Angular setup is an evaluation baseline** `preserved`
  `operator-authorized`
  - If an Angular host is chosen, evaluate the operator's normal combination
    of Prettier, NgRx, RxJS, Ramda, Ramda Adjunct, and Transloco or an equivalent
    message catalog. Localization should also keep user-facing strings out of
    components. This records desired ergonomics without prematurely selecting
    every library or fixing the UI architecture.
- **Plain workspace by default; Nx remains an evidence-gated option**
  `preserved` `operator-authorized`
  - Current Vitest performance removes unit-test speed as a reason to introduce
    Nx. Repeated operator and community experience with Nx daemon failures,
    including CI failures, is an explicit reliability cost. A later proposal
    may still adopt Nx for a bounded UI surface or the monorepo if measured
    graph, cache, generator, or orchestration benefits outweigh that cost and
    daemon-disabled operation remains dependable.
- **Code counterfactuals compile into profiling work orders** `adopted`
  `operator-authorized`
  - Generate bounded candidate changes, require semantic and quality parity,
    and measure them against an immutable baseline with a deterministic,
    repeatable harness. Machine-readable results preserve regressions and
    cost-shifting as well as wins; no candidate is promoted automatically.
    Reviewed contracts make the individual work orders executable even by
    inexpensive models. This specializes the earlier **Graded counterfactual
    builds** idea for code efficiency and is pinned in `docs/product/06-roadmap.md`
    §Counterfactual profiling work orders.

## WO-002 closeout additions (2026-08-31)

- **Namespace-tagged command identity** `adopted`
  - The `commandId` hash input now carries an `ep:`/`ws:` discriminator: an
    `episodeId` equal to any `workstreamId` used to collide with that
    workstream's episode-less commands, and the outbox idempotence guard then
    silently swallowed one of two distinct commands — live data loss on the
    recovery path. Pinned in the domain model's ID scheme as load-bearing.
- **Kernel declares, runtime executes (row 5)** `adopted`
  - Failure-matrix row 5's v0.1.0 scope is the pure guard: `guardQueuedPulse`
    re-evaluates presence and *declares* the NoOp-with-trace and the schedule
    ids to cancel; queue ownership, event-sourced presence, and executed
    cancellation are scheduler-runtime work (v0.4.0). Pinned in
    03-architecture.md so later rungs stop relitigating it.
- **A green runner over an absent suite is not evidence** `adopted`
  - WO-002's verifier proved the suite passed with the tests deleted (stale
    compiled output), and the first fix exposed a second hole (Node 22's own
    glob expansion runs zero tests green). The runner now cleans, force
    -builds, asserts compiled test files exist, then globs. Candidate future
    FeedbackUnit: evidence-gate runners must fail on an empty suite.
- **Refuse, never throw, at the authority boundary** `adopted`
  - `authorize` treats malformed intents (non-string effect, reachable
    through deserialized continuations) as structural refusals with trace,
    never TypeErrors — a thrown error produces no refusal event, no trace,
    and no log entry, which is exactly what the guard exists to prevent.
- **`documented officially` epistemic label** `adopted`
  - The Codex runtime map needed a class for vendor documentation distinct
    from locally installed help; Principle 15's label set gains
    `documented officially`. Origin: docs/discovery/codex-runtime-map.md.
- **Ideation anchored on the ladder; eight work orders drafted** `adopted`
  - The publication compiler (08) and audit map (09) gained roadmap rungs
    (v0.0.4 and v0.2.1), joined by v0.0.2 (environment addendum) and v0.0.3
    (capability table). WO-004 through WO-011 are drafted through v0.6.0,
    each with an evidence gate; PLAYBOOK carries their command blocks.

## Session additions (2026-08-31 — polar support ideation)

- **Oppositional Counsel support** `raw` `recovered`
  - Candidate support linked to an active mechanic that makes the active's
    PolarAxis relation materially present: it can alter soft activation
    pressure, produce an evidence-bearing critique of the favored option, or
    request a separately authorized review/refusal effect. Enthusiasm,
    argument quality, and authority remain orthogonal so confident opposition
    cannot manufacture permissions or veto power. Its proposed durable output
    is a typed `OppositionBrief`, reduced deterministically according to the
    relation taxonomy: inverse restores, complement supplies an omitted pair,
    counterweight checks excess, compensation attaches a repair. Preserved as
    an unsettled candidate in `05-pattern-library.md`; no implementation shape
    is pinned until a concrete scenario exercises it.
- **Beware of Naive Interventionism support** `raw` `recovered`
  - The operator manually adds "beware of naive interventionism" to nearly
    every task; preserve the exact phrase as the familiar lens and compile its
    intent instead of repeatedly paying for prompt prose. The candidate support
    compares action against non-intervention, asks what hidden functions and
    affected consumers the current system has, examines second-order harm and
    reversibility, and seeks the smallest discriminating probe. Its typed
    `InterventionBrief` may recommend proceed, stage, observe, NoOp, or
    escalation. It is a proportional counterweight to action bias—not ambient
    conservatism, analysis paralysis, or authority to veto—and remains
    unsettled in `05-pattern-library.md` until exercised by concrete scenarios.
- **Do Nothing as both active and support** `raw` `recovered`
  - Operator burst: `"do nothing" as both an active skill and a support. boom.
    figure it out`. The active form makes deliberate restraint the episode's
    primary behavior and emits an evidenced `NoOpIntent` with a reevaluation
    cadence and usefulness predicate. The support form modifies a linked
    active by making abstention a valid successful branch, with an action
    threshold and explicit conditions for reconsideration. This is distinct
    from waiting, stopping, failure, and the Naive Interventionism evaluator:
    evaluation may recommend non-action, while Do Nothing enacts and maintains
    it. Preserved as a dual-form candidate in `05-pattern-library.md`; exact
    compiler types remain unpinned pending a scenario using both forms.
- **Default to True / Default to False supports** `raw` `recovered`
  - Gladwell-derived paired supports that choose a provisional polarity only
    when applicable evidence, guards, and authority leave a proposition
    genuinely undecided. Default to True favors provisional acceptance,
    trust, or continuation; Default to False favors provisional skepticism,
    refusal, or verification. The trace must label the result as a default
    rather than evidence, name its scope and override condition, and expire or
    reevaluate when appropriate. They form a PolarAxis over provisional
    acceptance/skepticism, never a global personality trait or a way to bypass
    hard constraints. Preserved as an unsettled paired-support candidate in
    `05-pattern-library.md`.
- **Graded-proposition generalization for defaults** `raw` `recovered`
  - Operator follow-up: Default to True / False may be projections of a fuzzy
    or graded primitive. Preserve the generalization while separating
    epistemic support, behavioral activation, and decision policy so one
    scalar never impersonates truth, confidence, enthusiasm, and authority at
    once. Candidate starting point is an evidence lattice (`Supported |
    Refuted | Unknown | Conflicted`) with optional measured degrees; the two
    Gladwell supports choose how scoped `Unknown` resolves, while PolarAxes
    consume activation pressure independently. Recorded as an open refinement
    in `05-pattern-library.md`, not a supersession.
- **Default supports reduce to the existing PolarAxis** `transformed` `recovered`
  - Operator realization: the paired Gladwell supports may already be fully
    expressible as opposite scoped factors on a `provisionalAcceptance ↔
    provisionalSkepticism` PolarAxis. This becomes the leading hypothesis:
    reuse baseline + factors + `deriveBehavior(...)` and show the contribution
    in the build inspector. The graded/fuzzy proposition idea remains only a
    fallback if concrete scenarios cannot separate evidence, predicates, and
    activation pressure with current primitives. This avoids creating a new
    uncertainty subsystem merely because the UI exposes two named supports.
- **Common legos, local secret sauce** `adopted` `recovered`
  - Operator directive: DotLn is a customizable base for individuals, teams,
    organizations, and entire fields. It levels the playing field by giving
    everyone the same kernel, grammar, composition, authority, evidence,
    replay, and inspection legos; each implementation owns the valuable
    doctrine—its workstreams, integrations, sources, security, audit, logging,
    identities, roles, personalities, active/support combinations,
    evaluators, and learned history. The founding library is the author's
    first instance and proving ground, not a privileged canon. Instance
    content must compile through public IR and ports, remain inspectable and
    portable apart from secrets, and never require private kernel branches.
    Adopted into the vision, architecture boundary, and Principle 18.
- **Package ecosystem and marketplace** `adopted` `recovered`
  - Sparked while the operator watched a DHH interview on Lex: mature
    platforms commonly grow marketplaces for plugins, roles, configurations,
    and extensions. For DotLn this follows from the common-legos/local-doctrine
    boundary, but the marketplace itself is commodity infrastructure. The
    differentiator is inspectable distribution: roles, patterns, workstreams,
    evaluators, integrations, views, and starter implementations remain typed,
    version-pinned, permission-bounded, and mechanically transparent. Install
    never means activate; definition packs and executable adapters occupy
    different trust classes; compiled-effect and permission previews precede
    activation; private registries, local files, forks, and air-gapped use are
    first-class. Adopted as an ecosystem consequence in vision and architecture,
    not as near-term marketplace scope.
- **Agent enablement skill packs** `adopted` `recovered`
  - Implementations can offer skills that help their Claude, Codex, and other
    agents work effectively with DotLn: orient to WorkOrders, participate in
    episode lifecycle, inspect mechanics and authority, emit valid results and
    evidence, author instance definitions, run prescribed verification, and
    manage catalog packages. Base skills project the stable DotLn protocol;
    implementation skills add local vocabulary, schemas, integrations, and
    procedures. Skills remain ergonomic projections, ideally generated from
    the same contracts as CLI/help/UI and checked by conformance fixtures. They
    cannot become hidden canonical behavior or grant authority. Adopted as an
    agent-enablement package family and sparse-interface projection.
- **Community build workshop** `adopted` `recovered`
  - Operator wants community options, builds, and configurations to be easy to
    share, preview, mix and match, and sandbox. A `CommunityBuild` is a compact,
    content-addressed manifest over pinned components, shareable by file, link,
    or code without carrying credentials, protected sources, or event history.
    Opening enters Preview, not Install: resolve dependencies, show mechanics,
    permissions, costs, provenance, evidence, and semantic diff; remix or fork
    components; sandbox variants with fake adapters and fixtures or separately
    approved redacted replay; compare outcomes and first divergence; then
    selectively promote reviewed pieces into a reversible local version.
    Community content is untrusted by default, upstream updates are proposals,
    and the same flow supports public, private, filesystem, and air-gapped
    exchange. Adopted into package architecture and interfaces, not near-term
    marketplace implementation scope.
- **Bring-your-own-agent participation and preloaded coordination skills** `adopted` `recovered`
  - Operator clarification: a person may bring an independent harness and
    model, then download a runtime-compatible skill pack that lets the agent
    participate in that person's chosen DotLn implementation. DotLn negotiates
    runtime capabilities and can preload the minimum episode-scoped skills for
    protocol participation and intra-agent coordination: typed speech acts,
    claim/handoff/delegation, blackboard conventions, evidence exchange,
    dissent/escalation, topology duties, synchronization, cancellation, and
    continuation handoff. The bundle derives from WorkOrder + role + loadout +
    topology + runtime + authority, remains inspectable, and expires with the
    episode. Preloading every skill would recreate the aura stack; absent
    runtime enforcement cannot be faked with prose. Adopted as the onboarding
    membrane between arbitrary agents and a DotLn organization.
- **Runtime-native primitive universe** `adopted` `recovered`
  - Operator realization: DotLn can deeply use Claude's base primitives rather
    than treating Claude as a generic prompt endpoint. A discovered, versioned
    `RuntimePrimitiveCatalog` makes each harness a compiler target: semantic
    roles, actives, supports, permissions, integrations, WorkOrders, episodes,
    verification, and evidence may lower into combinations of native agents,
    subagents, skills, hooks, permissions, tools/MCP, commands, workflows,
    sessions, background execution, and structured outputs. The same mechanism
    may deliberately span several primitives. Claude is one rich target, not
    the ontology; Codex and other runtimes have their own catalogs, mappings,
    and explicit gaps. Runtime recipes can be shared and tested independently
    of instance doctrine. Adopted into architecture and the build inspector.
- **Codex as the first testable runtime target** `adopted` `recovered`
  - Operator chose Codex as the first concrete runtime map because it is the
    harness currently in use and can become the initial conformance target.
    The map inventories native instruction, skill, plugin, subagent, hook,
    permission, integration, session, structured-output, and lifecycle
    surfaces; proposes explicit DotLn lowerings; labels observation separately
    from documentation and untested hypotheses; and orders tests from inert
    inventory through skill activation, schema-bound episodes, opposition,
    authority, lifecycle, and package removal. Added as a discovery artifact,
    not a claim that Codex defines the portable ontology.
- **One source, many authoritative editions** `adopted` `recovered`
  - Operator wants the repo's purpose, vision, implementation, and evidence to
    recompile easily into multiple authoritative resources: initially books
    and conventional documentation for an everyday AI user, software
    engineer, manager, IT director, VP of development, CFO, and later other
    audiences. Adopted as a publication compiler over reviewed repository
    claims, not independent rewrites. Audience profiles change sequence,
    vocabulary, examples, and decision emphasis while preserving facts,
    limitations, authority, implementation status, and source lineage.
    Outputs may include books, reference sites, handbooks, briefings, training,
    in-product help, and agent skills. The bootstrap test is two divergent
    books from one claim graph with automatic staleness when a source changes.
- **Outline-first publication planning with implementation overlays** `adopted` `recovered`
  - Operator refinement: an outline may be all the publication system needs;
    if structure becomes necessary, use a small publication IR that references
    the existing DotLn IR and repository evidence rather than duplicating
    product truth. The current workflow has Fable 5 plan the authoritative
    DotLn/repository outline and the repeatable process/template for each
    concrete implementation, then assigns bounded rendering work to Opus 5 or
    Codex. Durable synthesis adopts `PublicationPlan` as a provisional,
    outline-shaped projection plan and `base plan + implementation overlay +
    audience profile` as the compilation formula. A claim-level IR is deferred
    until two editions demonstrate that source references are insufficient.
- **Audit as a family of evidence projections** `adopted` `recovered`
  - Operator wants the implementation space mapped for logging, auditing,
    persistence, recovery, backup, disaster recovery, and privacy, with audit
    first: different readers, visualizations, raw-data access, output levels,
    and recorded properties. Adopted as a shared audit-record vocabulary plus
    implementation-owned policy. One event/evidence graph can project receipts,
    narratives, control views, technical traces, governed raw records,
    timelines, causal/delegation/provenance graphs, authority overlays,
    evidence matrices, privacy/data-flow maps, recovery topologies, and bounded
    exports. Fidelity and seniority never imply access. The design separates
    diagnostics from durable audit, canonical state from rebuildable
    projections, effect reconciliation from backup, and auditability from
    indiscriminate sensitive-data retention. Bootstrap begins with six
    consequential record types and three views, then proves access control,
    ambiguous-effect recovery, and restore before adding platform complexity.
- **Skill-level feature progression** `adopted` `recovered`
  - Operator proposes rating features like skills, initially at zero or one,
    then selecting an implementation traversal: breadth-first laps that make
    each feature one skill point better; depth-first focus that carries one to
    production, professional, and polished quality; minimum release thresholds;
    or golf-style selection of the feature furthest behind. Adopted as
    evidence-gated capability levels and selectable portfolio policies, not an
    activity score. XP means admissible proof, and a level promotion requires
    every gate; the minimum required dimension prevents polished UI from
    averaging away security, recovery, or correctness gaps. The current
    semver roadmap remains intact, and the bootstrap artifact is a reviewed
    capability table rather than a premature scheduler subsystem.
- **Activation, utilization, and XP feed the constraint loop** `adopted` `recovered`
  - Operator connects the feature-leveling idea to the existing distinction
    between utilization and activation, then uses Theory of Constraints to
    decide which capabilities receive development attention. Durable synthesis
    keeps opportunity, activation, utilization, and XP/evidence gain separate:
    selection is not use, use is not causal value, and frequency is not
    maturity. Their gaps diagnose selection waste, aura passengers, unmeasured
    outcomes, weak capabilities, or blocked promotion gates. The constraint
    loop combines those signals with waits, failures, retries, handoffs,
    evidence gaps, operator burden, consequence, and counterfactual leverage;
    it never equates most-used with most-important or least-used with neglected.
- **Activation events retain option value** `adopted` `recovered`
  - Operator correction: activation itself produces events that may become
    useful later, even without present utilization. The model now preserves
    activation context, trigger fit, competing/suppressed candidates, cost,
    expiry, and later outcome linkage so future analysis can discover demand,
    false or missed activation, co-activation, drift, seasonality, and roads
    not taken. Activation evidence may advance the selector or activation
    policy and improve knowledge of applicability; it does not automatically
    claim that the activated capability became more effective.
- **Getting the reps in without constraint tyranny** `adopted` `recovered`
  - Operator does not want Theory of Constraints or maturity scoring to punish
    working on whatever currently attracts effort and getting better through
    repetition. Adopted as two evidence accounts: practice XP recognizes
    attributable reps, varied contexts, familiarity, samples, and discoveries;
    promotion evidence alone proves a maturity gate. ToC remains an advisory
    leverage lens unless a release contract explicitly makes a constraint
    blocking. Free practice/follow-interest becomes a first-class progression
    policy; DotLn may show opportunity cost and dependencies but must not shame,
    erase, or prohibit curiosity-driven craft within the authority envelope.
- **Final authorization of the post-WO-002 ideation set** `adopted` `recovered`
  - Before handing the worktree to Fable 5 for closeout, the operator explicitly
    authorized all extra ideation edits and files created during this stream,
    including the Codex runtime map, publication compiler, audit/resilience/
    privacy map, capability-progression additions, their blueprint references,
    the final efficiency-level refinement, ledger
    entries, and gitignored raw notes. This is documentation authority,
    not retroactive expansion of the WO-002 kernel implementation scope; the
    verifier record contains the complete path and topic reconciliation.
- **Efficiency level for every capability** `adopted` `recovered`
  - Operator's final refinement: continually consider avenues for efficiency,
    and give each skill/domain/capability an efficiency level even though the
    exact model was initially unclear. Durable synthesis separates maturity
    from efficiency and measures a resource vector per verified outcome:
    elapsed time, operator attention, tokens/calls, tool use, cost, retries,
    storage, and optional energy under comparable quality, authority, and risk
    conditions. Levels run from unknown baseline through measured, economical,
    profile-fit, local Pareto frontier, and adaptive. Efficiency awareness
    emits reversible optimization candidates rather than perpetual change;
    naive-interventionism and constraint checks prevent easy metric gains from
    exporting cost into correctness, privacy, recovery, or human burden.

## WO-002 implementation additions (2026-08-31)

- **Pinned serializable kernel contracts.** `adopted` WO-002 pins
  EventEnvelope v1, every Program payload, versioned predicate references, and
  deterministic command/event ID boundaries in the domain model and the pure
  TypeScript kernel. This transforms the earlier illustrative grammar into an
  executable, replayable contract without adding a new product concept.

## Scrub 001 (appended 2026-08-31 — public-repo privacy pass)

- **Employer-identifier scrub before public exposure** `adopted` `recovered`
  - The repo went public with the founding blueprint naming a specific
    commercial ALM product 11 times, plus passages attributing the predecessor
    to a specific employment context and describing a managed host behind an
    enterprise model gateway. All were genericized (enterprise tracker, ticket
    artifact, Source Revision Guard, source collector, constrained managed
    host). The founding commit was rewritten rather than corrected forward, so
    the original wording is not reachable from published history.
  - Unambiguous references to the predecessor became `v1`. The name is
    retained where it denotes this project's own vocabulary rather than the
    predecessor (`Launchpad IR`, the DAYLN subsystem, the operator quotes) —
    a deliberate split, not an incomplete rename.
  - `docs/discovery/` was coarsened in the same pass: exact OS build and
    browser patch levels are a patch-currency map of a personally
    identifiable machine and are not published. Toolchain versions stay,
    because later work orders depend on them.
  - *Accepted risk:* the SourceBundle domain model still describes a ticket
    artifact's shape (sections, discussions, attachments, pinned revision).
    That model is generic across trackers and is what DotLn is built on;
    removing it would gut the domain record for no identification gain.
  - *Deviation recorded:* this pass edited existing ledger entries in place,
    which the execution guide's ledger duty forbids. A privacy scrub of
    already-published text cannot be done by appending. Entry substance is
    unchanged; only identifiers were replaced.
  - *Generalized:* Before a repo with employer-adjacent intake goes public,
    scrub identifiers and machine fingerprint in one pass, and name the
    forbidden terms in CLAUDE.md — otherwise the next synthesis pass
    reintroduces them from intake that still contains them, while correctly
    believing it is following the rules.

## Session additions (2026-08-30)

- **Eye Dr Test (pairwise preference / Elo-family ranking)** `adopted` `recovered`
  - Operator hypothesis: A/B testing with Elo-style ranking "will end up being
    key" — the optometrist's forced binary choice as the primary interface for
    extracting quality judgment. Strong external precedent (RLHF reward models
    are Bradley-Terry over pairwise preferences; LMSYS Arena). Kernel-native
    form: Comparison events in the log; ratings as replaceable projections.
    Adopted in the non-forcing form: comparisons recordable from v0.1.0;
    tournament infrastructure only when evidence accrues. Registered as a
    hypothesis-flywheel entry: revisit when a meaningful comparison corpus exists.
- **Operator-in-the-fun-loop** `adopted` `recovered`
  - The giant syntax-highlighted markdown review of proposed changes "will
    never get automated as that is the most fun part" — hand-authoring
    identities/patterns via reviewed markdown is a first-class permanent path;
    the compiler must accept hand-written sources and never require the GUI.

## Notes 002 (appended 2026-08-30 after fidelity review)

- **Westworld reveries** `preserved` `recovered`
  - Feedback agents built from single rules (with verbatim originating
    incidents) used like reveries: mixable into different personalities, agent
    modes, or roles — identity fragments that recombine.
- **3–6 rules vs. all-100+ experiment** `preserved` `recovered`
  - Run both compositions — small focused rule bundles and a
    notion-of-everything agent — and compare ("i guess i could try both").
    A natural early Eye Dr Test candidate.
- **UX first, tooling second** `adopted` `recovered`
  - "I need to think of the ideal way to manage these agents and program them.
    then create the tooling around that. the user experience has to come
    first." Honored by the roadmap's per-rung visible-payoff rule.
- **Americanization prose agent** `adopted` `recovered`
  - The archetype of a deterministic output transformer: don't make agents
    remember spelling rules; run all output through a transformer. Landed as
    mechanism rung 4.
- **Single host app registering listener agents** `adopted` `recovered`
  - One host process registers many feedback listeners instead of dozens of
    independent terminals — landed as the control-plane host in architecture.
- **Word-cloud frequency loading** `adopted` `recovered`
  - The operator's measurable baseline for rule loading (top ~50% by invocation
    frequency always loaded; factorize rules if it outgrows memory). Landed as
    the v1 baseline AttentionPolicy that fancier formulas must empirically beat.
- **Meta-traffic-cop** `preserved` `recovered`
  - An agent that checks whether the traffic cop itself is degrading (giving up
    early, stalling) — supervision of the supervisor.
- **Transcript mining for activation cases** `preserved` `recovered`
  - Saved session transcripts as the dataset for discovering when feedback
    agents should activate.
- **TI-83 11-ball universe growth** `preserved` `recovered`
  - Grow the event-type × response universe slowly and progressively, like
    adding cases to a toy program; completeness emerges, never big-bang.
- **Handoff failure→fix tables** `preserved` `recovered`
  - Session handoffs containing "Failure → Fix" tables ("recorded because prose
    alone has not prevented repeats") — ready-made seed corpus for FeedbackUnits.

## Notes 001 (appended 2026-08-30 after fidelity review)

Ideas from the operator's first notes file not already woven into chat entries:

- **Two-role future org** `preserved` `recovered`
  - Product-oriented people with SME-level screen knowledge doing flowchart-grade
    future-state definition; everyone else as architects/scrum-masters for their
    own agent fleets, responsible for verifying and shipping what the fleet makes.
- **Team Topologies + Turn the Ship Around applied to agents** `adopted` `recovered`
  - The Marquet lessons taught to team members apply *more* cleanly to agents;
    landed as the Ladder-of-Leadership protocol in the pattern library.
- **Competence + clarity precede autonomy** `adopted` `north-star`
  - "If i want to give over more control to claude, the first problem is how do
    i increase its technical competence and clarity to the mission/goal."
- **Craftsmanship at a higher level** `adopted` `recovered`
  - Hand-craft love acknowledged; the claim is that quality principles can be
    taught/templated and craftsmanship relocates to the meta-level.

## Images (reference corpus)

Images live in local-only intake; entries here record what each contributes.

- **0.png** (screenshot-of-chat, medium): Feeds the 'feedback rules compiled into typed mechanisms' pillar and the reactive 'feedback agents that mirror the operator's own reactions to signals': gumption traps are exactly the operator-side signal categories (friction, stall, morale drain) that DotLn guards/reactors/evaluators should detect and compensate for. Also motivates operator present/absent policies — the system should absorb these traps instead of passing them to the human. — Not a design artifact, but it supplies a ready-made 7-category event taxonomy for the negative-signal side of the feedback system (what the kernel should classify and route around). Useful vocabulary for event types and evaluator triggers; does not constrain architecture or UI.
- **0CMABqcVcR9oaBgVl.png** (reference-image, high): Directly the 'David Marquet Ladder of Leadership' pillar of the isomorphic business/leadership interface. Gives the exact 7-rung scale for encoding an agent's (or episode's) autonomy level, the escalation/de-escalation policy between operator and agent, and the operator present/absent policy dial. Could also render as the RPG loadout view (autonomy as an equipment stat) since it is one of the isomorphic interfaces of the same underlying program. — This is the concrete, canonical enumeration DotLn needs to type agent autonomy: seven discrete levels, each with a natural-language prompt template the orchestrator can literally use when addressing a worker episode, plus an obvious color encoding for UI. It converts a vague 'autonomy' knob into a typed mechanism.
- **377dba5f-be75-4c12-adb6-ad0774738162.png** (screenshot-of-chat, medium): The 'commedia dell'arte party roles' isomorphic interface: a typed trio of agent archetypes with explicit status levels and interaction dynamics. Whiteface = rule-setting orchestrator/guard, Auguste = eager worker episode that fails in-distribution, Contra-Auguste = chaos/fault-injection agent. Also relevant to Horizon 3 agent-ecology experiments (deliberately composing parties whose dynamics produce known failure cascades for counterfactual study). — Gives DotLn a concrete, well-theorized role template — status hierarchy plus a canonical error-propagation pattern — usable both as an agent party-composition preset and as a chaos-testing scenario. It is inspiration-grade rather than mechanism-grade, so medium.
- **454404c1-07e3-43e8-ba54-831a1218dabc.png** (screenshot-of-chat, medium): Deep background for the commedia dell'arte party-roles interface. The three-class trope structure is the useful part: Vecchi = constraint-holders/blockers (guards, budget owners), Zanni = resourceful worker agents that route around obstacles via improvised bits, Innamorati = goal-holders whose desires drive the plot (the operator's objectives). Supplies a stable naming vocabulary for agent archetypes. — The class taxonomy (blockers / fixers / goal-carriers) is a genuinely mappable structure for agent role presets and scenario templates; the Roman ancestry portion is flavor only. Worth mining for the role-naming layer of the isomorphic interface, but nothing here dictates architecture.
- **5bc17b16-0fec-4472-9bc8-6b905dfb6149.png** (screenshot-of-chat, medium): Source vocabulary for compiling human judgment into typed mechanisms: optimal stopping and explore/exploit map to episode scheduling and search policies in the deterministic kernel; caching/LRU maps to external memory and evidence-graph retention; scheduling maps to task prioritization in the orchestrator; 'embrace randomness' maps to explicit, controlled RNG in the pure kernel; 'computational kindness' is essentially the operator-facing design principle behind feedback agents and isomorphic interfaces (reduce operator cognitive load); 'overfitting' warns against over-elaborating the 140+ prose feedback rules. — Not a design artifact, but it names concrete, well-known algorithms (37% rule, Gittins index, LRU, earliest-deadline scheduling) that can become named, typed policies in the kernel - a ready-made menu of decision mechanisms - and 'computational kindness' is a strong candidate for a stated product principle. It shapes vocabulary and policy choices rather than any specific screen or component.
- **5eeab60c-f9ad-4a29-a985-2b366ca61b18.png** (screenshot-of-chat, medium): Direct source material for the business/leadership pattern-language isomorphic interface named in the primer ('5S/Seiri'). The five pillars translate naturally onto agent-session hygiene: Sort = strip context bloat from episodes (only what the task needs); Set in Order = a specific home for everything (event store, evidence graph); Shine = inspect while cleaning (evaluators surfacing wear/problems); Standardize = compile recurring practice into typed mechanisms; Sustain = feedback rules that keep the habits running; Safety = guards. — The content is a generic public definition, but it is the canonical vocabulary for one of DotLn's named isomorphic interfaces, and the pillar-to-mechanism correspondence (including the optional sixth 'Safety' = guards) is clean enough to lift straight into the blueprint's pattern-language rendering.
- **a33e14d5-d4e1-4d8b-948e-ed327d970ab6.png** (screenshot-of-chat, high): Companion to the David Marquet Ladder of Leadership named in the primer: a graded, enumerable scale of speech directness/authority. Maps onto agentic communication design - a typed 'assertiveness level' on messages between agents and between agents and the operator; escalation policy for feedback agents (how forcefully a signal is voiced); operator present/absent policies (agents may be required to speak at Command level when the operator is absent, since Hints fail without a listener doing the interpretive work). — This is a ready-made 6-value enum for message assertiveness that can be compiled directly into typed mechanisms - exactly the kind of prose-rule-to-mechanism translation DotLn is about. It concretely operationalizes the leadership-ladder pillar and its aviation-safety framing motivates guard rules (danger signals must not be delivered as Hints).
- **fa6c8d31-66d5-4c91-9c11-da245e1213e1.png** (screenshot-of-chat, medium): Direct source material for the commedia dell'arte party-roles pillar: a minimal three-role status hierarchy for composing agent parties. Whiteface = orchestrator/planner holding authority; Auguste = worker agent that executes and errs productively; Contra-Auguste = chaos/adversarial agent (fuzzer, red-team, randomness injector). Also relevant to Horizon 3 agent-ecology experiments where fixed status relationships shape emergent interaction. — Gives the commedia pillar a concrete, minimal 3-slot party template with explicit status ordering - useful as a default multi-agent composition preset and as a legible metaphor in the isomorphic RPG/party interface - though it is a metaphor seed rather than a mechanism spec.
- **image (1).png** (reference-image, medium): An analogy for DotLn's observability/inference story: hidden parameters (an agent's policies, prompt, model temperament) determine dynamics (episode behavior) which determine observables (events in the event store, evidence graph). Evaluators run this chain backwards - inferring hidden state from collected observables - and Horizon 3 counterfactual experiments are exactly 'vary the hidden parameters, re-run, compare observables'. Also ties to the explicit time/RNG pillar: only what is emitted as events is observable and replayable. — The parameters -> dynamics -> observables framing is a crisp mental model worth stating in the blueprint for the evidence graph and the Horizon 3 lab (it motivates designing the event schema around what evaluators will need to infer), but the image itself is inspiration, not a design to copy.
- **image_(1).png** (reference-image, medium): Visual metaphor for the Horizon 3 counterfactual laboratory: an ensemble of simulation runs ('universes'), each configured with different agent parameters (reflection policy, agent swaps, RNG seed), rendered side by side so the operator can compare which configuration best matches desired reality. The gauges-inside-orbs treatment also feeds the isomorphic-interface aesthetic - per-run dashboards (mana/token budget, cadence) as dials on an RPG-flavored loadout, adjacent to marble-timeline visual language. — Directly suggests a UI pattern for the counterfactual lab: a gallery of run-orbs, each with its parameter dials, supporting compare-and-identify workflows across simulation branches. It is an aesthetic/interaction seed rather than a spec, but it is the most concrete visual idea in this batch for Horizon 3.
- **image_(10).png** (reference-image, high): Theory of Constraints leg of the isomorphic-interfaces pillar; also directly parallels DotLn's 'atomic single-purpose agents composed like legos' — a minimal set of dependency primitives (feeds-constraint, fed-by-constraint, joins-at-assembly, independent) from which any agent pipeline topology can be composed, and from which the kernel can derive universal scheduling rules. — This is the most blueprint-actionable of the six: it proposes a concrete, minimal vocabulary of composition primitives for agent dependency graphs, and a method (analyze the four primitives, generalize the invariants) the deterministic kernel could use to type-check orchestration topologies and derive throughput/constraint rules mechanically instead of as prose feedback rules.
- **image_(11).png** (reference-image, medium): Theory of Constraints pattern language. Maps to DotLn resource governance: worker episodes and subagents should be paced by the system constraint (operator review bandwidth, token/mana budget, evidence-graph integration capacity), not by their own capacity to generate output; idle agents are fine — un-reviewed agent output is 'excess inventory'. — Supplies a crisp rule the blueprint can compile into a typed guard/evaluator (throttle non-constraint agents to the constraint's pace; penalize output that outruns integration), but it is supporting doctrine rather than a design in itself.
- **image_(12).png** (reference-image, medium): Theory of Constraints pattern language. Direct analogue for DotLn's disposable episodes and feedback-rule compilation: an agent being busy (activated) is not the same as an agent producing goal-directed value (utilized). Candidate compiled evaluator: measure episodes by throughput toward the goal state, never by activity, tokens burned, or parallelism achieved. Also speaks to subagent-overspawn guards and operator-absent policies. — The activation-vs-utilization distinction is a load-bearing metric definition the blueprint should adopt for episode evaluators and dashboards (goal-progress metrics over activity metrics), though again it is a principle to encode rather than a mechanism design.
- **image_(13).png** (reference-image, medium): Theory of Constraints, specifically a cautionary case for DotLn's 'feedback rules compiled into typed mechanisms': a static priority rule (red before green) is itself a policy that creates starvation and new queues. Relevant to the kernel's scheduler/statechart design (priority policies need counterfactual testing) and to Horizon 3's laboratory for running policy experiments and observing emergent side effects. — Valuable as a canonical failure narrative the blueprint should design against — absolute-priority scheduling of episodes/queues causes starvation, so priority policies should be expressed as tunable, observable mechanisms with counterfactual evaluation — but it contributes a test case, not a component.
- **image_(15).png** (reference-image, medium): Theory of Constraints pattern language. For DotLn: the binding constraint may live entirely outside the agent-execution system — e.g. the human operator's capacity to review, decide, and absorb agent output. Reinforces operator present/absent policies and the 'compiler and runtime for human judgment' framing: human judgment bandwidth is the market that absorbs agent throughput. — Extends the constraint model beyond internal bottlenecks to external demand, which is exactly the right frame for sizing agent output to operator attention; worth encoding in the blueprint's constraint taxonomy, though as principle rather than mechanism.
- **image_(16).png** (reference-image, high): Directly feeds the 'Theory of Constraints' entry in DotLn's business/leadership pattern language (isomorphic interfaces pillar). More concretely, the five focusing steps are an executable orchestration algorithm: a feedback rule compiled into a typed mechanism — a reactor/evaluator loop that identifies the current system constraint (operator attention, token/mana budget, a slow evaluator, a blocked agent), exploits it (never idle the constraint), subordinates other agents' cadence to it (boots/cadence metaphor, red/green tags map to priority tagging of work items in the event store), elevates it, and re-runs when the constraint moves. Also resonates with statechart loops and the deterministic control kernel (the loop is pure and repeatable). — This is not just flavor — it is a concrete, well-tested control-loop algorithm that can be literally encoded as a DotLn reactor/scheduler policy (constraint identification over the evidence graph, subordination as scheduling policy, tags as typed priorities). It gives the TOC facet of the pattern-language interface real semantics instead of being a label.
- **image_(17).png** (reference-image, medium): Complements image_(16): the constraint is not static and is not always a physical resource — it migrates (machine → release policy → demand). In DotLn terms: the binding constraint on an agent system shifts between token budget, model capability, operator judgment bandwidth, feedback-rule coverage, and evaluation throughput; the orchestration loop must re-identify it each cycle rather than hard-code it. Also a vocabulary lesson for the blueprint's typed ontology: name things by their role in the system ('constraint'), not their first physical instance ('bottleneck') — relevant to how DotLn types guards/reactors/evaluators generically. — Adds the crucial dynamic-constraint nuance (re-identify every cycle; constraints can be policies or external demand, not just resources) and a naming discipline for the ontology, but the actionable algorithm itself is carried by image_(16).
- **image_(19).png** (reference-image, medium): Philosophical grounding for DotLn's feedback architecture: the system should compile and amplify the OPERATOR'S own judgments ('trust yourself and your own feeling') rather than import generic external critique — exactly the rationale for reactive 'feedback agents' that mirror the operator's own reactions to signals, and for compiling the operator's 140+ prose rules into typed mechanisms instead of borrowing off-the-shelf rubrics. 'Allow your judgments their own silent, undisturbed development' also suggests letting evidence accumulate in the event store/evidence graph before forcing an evaluation (reflection policies, Horizon 3). — It articulates a real design principle — feedback mechanisms must be derived from the operator's own reactions, and evaluation should sometimes be deferred until judgment has 'gestated' — which can shape evaluator and reflection-policy design; but it remains an ethos statement, not a spec.
- **image_(2).png** (reference-image, high): The theoretical backbone of the isomorphic-interfaces pillar: the RPG loadout, 5S/Marquet/TOC pattern language, statecharts, function tables, RxJS marble timelines, TypeScript DSL, and event timelines are alternative 'geometries' over the SAME underlying program — none more true, each more convenient for a given task or audience. Crucially, Poincaré's one limit ('avoiding all contradiction') translates into a hard blueprint requirement: every view must be a consistent projection compiled from one canonical representation (the pure kernel + event store), never an independently drifting picture. — Beyond justifying a core pillar, it supplies a testable design criterion — views are freely chosen conventions but must be non-contradictory projections of a single source of truth, and views should be selected/recommended by convenience for the current task. That directly shapes the rendering architecture in the blueprint.
- **image_(20).png** (reference-image, medium): The theory behind DotLn's evaluators and LLM-as-judge calibration: an AI evaluator will reproduce the operator's Quality judgments only to the degree it shares the operator's 'a priori analogues' — i.e., context, examples, and compiled feedback rules. Hence the pillar of compiling the operator's prose feedback into typed evaluators/guards, and feedback agents that mirror the operator's reactions: they are attempts to install the operator's analogues into disposable episodes so quality judgments converge. Also predicts where judges will fail — out-of-distribution work (the 'medieval poems' case) — motivating operator-present policies as fallback. — Gives a crisp mental model for when automated evaluation can be trusted (shared analogues, in-distribution work) and when it must escalate to the operator, which should inform evaluator calibration and operator present/absent policy design — but it is conceptual grounding, not a mechanism spec.
- **image_(21).png** (reference-image, medium): This is the philosophical thesis behind 'a compiler and runtime for human judgment': the operator's preintellectual value judgments (Quality) are the source from which DotLn's typed structures — guards, reactors, evaluators, statecharts — are derived and continuously re-derived. It also grounds the idea that feedback rules must evolve (immutable events, but revisable compiled mechanisms) rather than ossify into static prose rules. — It supplies the project's core framing (judgment precedes structure; structures must stay revisable) and belongs in the blueprint's philosophy/why section, but it contains no concrete design, UI, or mechanism to build.
- **image_(22).png** (reference-image, medium): Grounds DotLn's reactive 'feedback agents' that mirror the operator's own reactions to signals: the operator's trainable 'sense of what's good' is exactly what gets compiled into evaluators and transformers. Also supports the evidence-graph idea — the sense is developed through 'contact with basic reality,' i.e., grounding judgments in real observed events rather than prose rules. — Directly motivates the feedback-agent/evaluator pillar and the claim that operator judgment can be captured and improved over time; philosophical justification rather than buildable design.
- **image_(23).png** (reference-image, medium): Maps to DotLn's operator present/absent policies and the David Marquet Ladder of Leadership: the design goal of agents (and operators) acting from intent rather than external prodding. Also informs Horizon 3 reflection-policy experiments — intrinsically-motivated vs extrinsically-scored agents — and cautions against reward structures that optimize for 'grades' (metrics) over knowledge. — Gives a concrete design stance for autonomy policies and agent incentive design (intent-based, not compliance-based), which is actionable at the policy-design level even though it prescribes no mechanism.
- **image_(26).png** (reference-image, medium): The most design-relevant of the set: it names the central tension in DotLn's agent architecture. DotLn composes atomic single-purpose (specialized) agents, while arete prizes the whole-life all-rounder and a systems-level 'higher efficiency' — which is precisely the Theory of Constraints stance (optimize the whole, not one department) and the commedia dell'arte party-roles idea (excellence emerges from the composed ensemble, not any specialist). The Thoreau line is a design caution for gem/support-link tradeoffs: every capability modifier gained costs something. — It articulates the specialization-vs-wholeness tension the blueprint must resolve (atomic agents composed into an ensemble with system-level efficiency), making it genuinely useful framing for architecture decisions, though still philosophical rather than mechanical.
- **image_(27).png** (reference-image, high): Directly formalizes the deterministic pure control kernel: Powell's transition function S_t+1 = S^M(S_t, X_t, W_t+1) is isomorphic to DotLn's pure reactor signature (state + event -> next state + intents + continuation), with Exogenous Information W_t+1 mapping to events arriving from the nondeterministic edge (AI episodes, operator input) and the explicit time/RNG pillar. The Four Classes of Policies give a principled taxonomy for DotLn's typed mechanisms (guards/reactors ≈ PFAs, evaluators ≈ CFAs/VFAs, planning episodes ≈ Direct Lookahead) and for operator present/absent policies. The 'practitioners favor simpler policies' finding validates compiling feedback rules into cheap typed mechanisms rather than heavyweight lookahead. — This is a ready-made, battle-tested vocabulary the blueprint can adopt wholesale: naming DotLn's kernel loop in Powell's five-component terms and classifying every feedback mechanism into one of the four policy classes would give the architecture rigor, a literature to draw on, and one more isomorphic interface (the SDA/operations-research rendering alongside RPG loadouts and statecharts).
- **image_(28).png** (diagram, medium): The motivating problem statement for DotLn's whole architecture: the alternating Decision/Information stages are exactly the kernel's event-then-intent cadence, and the exponential blow-up is why raw lookahead over agent futures is intractable — justifying compiled policies (typed guards/reactors/evaluators), immutable event-store replay instead of tree search, and Horizon 3's simulation laboratory as the sanctioned place to explore counterfactual branches deliberately rather than implicitly. — It is rationale rather than design — an excellent 'why the kernel exists' figure to recreate (in original form) in the blueprint's motivation section, but it prescribes no concrete DotLn structure beyond what image_(27) already gives more precisely.
- **image_(3).png** (reference-image, medium): Philosophical foundation for 'a compiler and runtime for human judgment': the operator cannot attend to the infinity of signals an agent swarm emits, so DotLn's feedback rules ARE Poincaré's 'choice of facts' — compiled selectors for which observations matter. 'Facts which serve many times' maps to which recurring operator reactions deserve compilation into typed mechanisms, and the hierarchy of facts maps to the evidence graph's curation policy (what external memory keeps vs. discards). — It will not change any component design, but it supplies the blueprint's animating thesis in quotable form — a strong candidate for the philosophy/vision section explaining why judgment must be compiled (selection under finite attention) rather than exhaustively prompted.
- **image_(4).png** (reference-image, medium): Extends the judgment-compiler thesis with operational implications: once a feedback rule is compiled and reliable, its conforming events stop deserving operator attention — DotLn's reactive feedback agents should surface only EXCEPTIONS (anomaly-first attention routing), and Horizon 3's counterfactual laboratory is exactly Poincaré's 'seek the cases where the rule has the greatest chance of failing.' 'Likenesses hidden under apparent divergences' is a neat one-line justification for the isomorphic-interfaces pillar (RPG loadout, statecharts, marble timelines as the same underlying program). — Like image_(3) it shapes philosophy rather than components, but it yields two directly actionable design principles — exception-driven feedback-agent attention, and rule-falsification as the purpose of the Horizon 3 simulation lab — plus the best available epigraph for the isomorphic-interfaces section.
- **image_(5).png** (reference-image, medium): Disposable task-scoped episodes at the nondeterministic edge (crowds of colliding ideas) versus external memory that crystallizes and outlives the session (event store, evidence graph). Also the 'compiler for human judgment' framing: condensing much experience into a slender, reusable volume is exactly what compiling 140+ prose feedback rules into typed mechanisms does. — It contributes no UI or mechanism directly, but it is strong narrative grounding for the blueprint's core generate-select-crystallize loop and could anchor the blueprint's philosophy/why section and naming (e.g., a 'crystallization' phase name).
- **image_(6).png** (reference-image, high): The thesis statement DotLn answers: feedback rules that 'must be felt rather than formulated' are precisely what DotLn tries to formulate — compiling operator judgment into typed guards, reactors, evaluators, and transformers, and into reactive 'feedback agents' that mirror the operator's own reactions. 'Avoid the trouble of making them' maps to guards that prevent useless work before an episode is even spawned. 'Analogies to established mathematics' echoes the isomorphic-interfaces pillar (the same structure recognized across renderings). — This page contains the sharpest articulation of DotLn's core problem statement and its central design bet (mechanize the selection function, not the generation). It should shape the blueprint's framing of guards/evaluators and the operator-judgment compiler; a strong candidate epigraph.
- **image_(7).png** (reference-image, medium): The 'subliminal self' is the archetype for DotLn's reactive feedback agents and evaluators: a standing background process that watches a large stream of candidate outputs/signals and surfaces only the interesting ones to the operator — mirroring the operator's own taste. Also supports the attention-economics rationale for operator present/absent policies (protect the operator's conscious channel). — Gives the feedback-agent layer a crisp conceptual identity and a filtering contract (surface only what breaks the interestingness threshold), but is philosophy rather than mechanism; influences framing and evaluator design goals more than concrete structure.
- **image_(8).png** (reference-image, medium): 'Harmonious order of the parts' is the aesthetic case for DotLn's composition pillars: atomic single-purpose agents composed like legos, PoE-style gem links, and isomorphic interfaces (the same relational structure grasped through many renderings). 'Relation of things... is the sole objective reality' argues for the evidence graph — relations, not raw outputs, as the durable truth. — Closes the philosophical arc begun in images 5-7 and directly motivates the evidence-graph and composition-over-monolith choices, but like its siblings it informs the blueprint's rationale and evaluator criteria rather than specifying features.
- **image_(9).png** (reference-image, high): A ready-made classification scheme for DotLn's compiled feedback mechanisms: guards/evaluators are negative feedback loops (level 8), transformers and agent composition are structural interventions (levels 10/4), the event store and operator visibility are information flows (level 6), typed rules are level 5, statechart goals are level 3. Also complements the business-pattern-language interface (Theory of Constraints, Marquet ladder) and the Horizon 3 ecology lab, where experiments amount to interventions at different leverage levels. — Unlike the philosophical pages, this is directly operationalizable: tagging each mechanism type and each piece of operator feedback with a Meadows leverage level would give the blueprint a principled hierarchy for where feedback should be compiled to, and a shared vocabulary across the isomorphic interfaces.
- **image.png** (reference-image, medium): Direct evidence for DotLn's model-agnostic pillar and for compiling feedback rules into typed external mechanisms instead of prose in model context: prose rules baked into prompts become counterproductive when the model generation changes, whereas guards/evaluators outside the session can be tuned per model. Also touches episode design (delegation readiness and verbosity are per-model episode parameters the kernel should own). — A concrete, citable justification for keeping behavioral policy out of prompts and in the kernel's typed mechanism layer with per-model profiles; it motivates a specific blueprint requirement (model-capability profiles that gate which compiled rules are injected) but is a single data point, not a design.
- **image.png** (screenshot-of-chat, high): Feedback rules compiled into typed mechanisms — specifically evaluators: a Quality-aspect taxonomy (each aspect demonstrated by a paired improving technique) instead of prose rules; also 'compiler and runtime for human judgment' (Quality recognized by a nonthinking process = the operator's fast reaction, mirrored by reactive feedback agents); rote-fulfillment detection maps to guards rejecting letter-not-goal outputs. — This is the philosophical charter for the evaluator/feedback-rule pillar: it argues quality dimensions should stay loosely defined but be operationalized through paired concrete techniques and demonstrations — exactly the compile-140-prose-rules-into-typed-mechanisms move. It should shape how DotLn evaluators are named, structured (aspect + technique + demonstration), and how rote compliance is penalized.
- **LadderofLeadership2.png** (diagram, high): The Marquet 'Ladder of Leadership' isomorphic interface named in the primer; operator present/absent policies (rungs 6-7 are exactly operator-absent, act-then-report modes); agentic communication protocol — each rung is a typed message pair between agent and operator, so an episode's autonomy level is literally the grammar of its messages; also feeds guards (which rung an agent may speak at is a compiled permission). — Directly supplies the concrete 7-level autonomy scale for DotLn's operator-agent protocol: each rung defines both sides' message types, giving a ready-made typed enum for permission levels, escalation, and present/absent operator policy. It is one of the primer's named isomorphic renderings, so this is source material, not decoration.
- **maxresdefault.png** (reference-image, medium): Companion to the Ladder of Leadership isomorphic interface: where the ladder gives the discrete autonomy scale, this gives the tuning function — control level as a computable function of competence (an agent's evidence/eval history) and clarity (task spec quality). Maps to 'compiler and runtime for human judgment' (judgment as an explicit formula), to guards/policies that set an episode's permission rung, and to operator present/absent policy tuning. — Largely reinforces the ladder image, but the equation framing — control = f(competence, clarity), with empowerment rejected as a standalone 'program' — is a distinct, directly implementable design rule for how DotLn's kernel should compute an agent's autonomy rung from measured signals rather than setting it statically. Worth encoding; not a standalone pillar.
- **Screenshot 2026-08-30 at 10.01.24 PM.jpg** (reference-image, medium): The primer's 'old emoji + Tailwind CSS manipulation UI experiment'; feeds the isomorphic-interface pillar as a rendering technique: a zero-asset parametric icon system for showing agent/episode state on RPG loadouts, event timelines, and marble diagrams (fade = budget/mana drain, red silhouette = guard trip, inverted = counterfactual branch, blur = uncertainty, rotation/mirror = direction or undo). Also echoes PoE 'links': one base glyph composed with stacking modifier classes, like a skill gem plus support gems. — Not a conceptual pillar, but a concrete, immediately reusable UI technique: the utility-class recipes here (especially the text-transparent + text-shadow recoloring trick and filter/transform stacking) give DotLn a full state-glyph vocabulary from plain emoji with no asset pipeline — a natural fit for the timeline and loadout renderings. Should inform the UI layer of the blueprint, not its architecture.

Low-signal images (recorded, no entry): 17ffd23b-3276-4ca9-a811-7f3e944c64de.png, 587a2ca9-ac76-40d1-a236-2a2ce94c9406.png, image_(14).png, image_(18).png, image_(24).png, image_(25).png, image_(29).png, image_(30).png

## Chat 011

*Operator ask:* Dylan asked GPT to work out how the original five-way founding experiment actually resolved, given that his v2 ideation repo "ended up almost being the builder itself" (knocking off two experiments), that he was still hand-crafting it (his fifth test), and that base Claude proved too much of a step back in rules and constraints to be a viable founding lane. He then declared the analysis phase over: v2 gets built now with whatever is in global Claude plus repo and local-repo Claude config, the latter two created iteratively during the build.

- **Five-way experiment collapse** `adopted` `tension`
  - The five founding prototypes (v1-builds-v2, v1-builds-builder, base-Claude-builds-v2, base-Claude-builds-builder, hand-rolled) already ran in a messy blended form and converged; rebuilding five isolated lineages now would produce ceremony, not information. Delete the prototype repos, the architecture tournament, and the clean-room lane from the plan.
- **Ideation repo as the de facto builder** `adopted` `recovered`
  - Dylan's v2 ideation repository became the builder itself: it transforms raw source material into architecture, canonical concepts, a first vertical slice, milestones, and executable work orders. A builder need not be a finished executable application — that transformation IS builder behavior, and it satisfied experiments 2 and 4.
- **Base-Claude failure proves rules are load-bearing** `adopted` `recovered`
  - A clean base model being dramatically worse is not evidence the clean-room experiment failed; it is evidence the accumulated 140+ constraints, examples, and corrections are genuinely load-bearing — even though their ~400k-token prose representation is pathological. The fix is compiling that competence, not deleting it and hoping base Claude recreates it.
- **Full-context bootstrap with progressive self-hosting** `adopted` `tension`
  - The selected founding route: build v2 with the entire existing global Claude / v1 environment intentionally active as temporary bootstrap scaffolding, then progressively replace inherited prose with typed mechanisms and let v2 coordinate its own construction. The inherited environment is scaffolding, not part of v2's target runtime semantics.
- **Strangler migration of the cognition layer** `adopted` `recovered`
  - Architectural framing of the bootstrap: never delete load-bearing v1 behavior before its replacement exists; use that behavior to build deterministic replacements, then retire the corresponding prose/context dependency once the replacement is proven. Loop: retain inherited competence → externalize one behavior into v2 → test it → stop depending on inherited prose for that behavior → repeat.
- **Migrate-on-contact rule** `preserved` `tension`
  - Never copy the 140+ global rules into the v2 repo and never inventory them up front. When a global rule materially affects current v2 work: identify the behavior it protects → classify its proper v2 mechanism → implement or schedule it → shadow-test → mark the global dependency replaceable. Use inherited rules freely meanwhile, but never auto-encode them into DotLn. Replaces the north star's plan of selecting ten representative incidents first.
- **Inherited Context Ledger** `preserved` `recovered`
  - A deliberately small markdown table tracking only inherited behaviors that have materially affected active work: behavior, current source, why still needed, planned v2 replacement mechanism, evidence, and lifecycle state (inherited → identified → replacement-building → shadowing → replaced → retired). Entries are added on contact, never by inventory.
- **Shadow-testing rule replacements** `preserved` `recovered`
  - Before retiring an inherited prose rule, its typed v2 replacement runs in a 'shadowing' state alongside the inherited behavior until evidence (guard tests, hook tests, E2E fixtures) proves it, giving a safe cutover point per behavior.
- **One ADR closes the founding question** `preserved` `recovered`
  - Preserve the whole five-way history in a single decision record (docs/decisions/0001-full-context-progressive-self-hosting.md) with status Accepted, then stop running it as an experiment; clean-room provenance is explicitly not a project objective and authorship credit between v1, base Claude, and the operator is not worth proving.
- **Self-hosting as milestone, not founding route** `preserved` `recovered`
  - The one surviving idea from the base-Claude experiments: once the first walking skeleton can persist a workstream, compile a bounded work order, invoke a fake executor, and replay its state, v2 itself starts coordinating construction of its next slice. Self-hosting begins incrementally after the first executable slice, never as the bootstrap mechanism.
- **Config-surface layering strategy** `transformed` `recovered`
  - Explicit purpose mapping for each Claude Code surface: global Claude = temporary bootstrap competence; project CLAUDE.md = stable shared DotLn facts and operating decisions; CLAUDE.local.md = machine paths, private repo locations, temporary personal preferences; .claude/settings.json = shared permissions/hooks/enforcement; .claude/settings.local.json = machine-specific gateway/model/experimental settings; .claude/rules/ = path-scoped instructions introduced only when the corresponding area exists; DotLn code/tests/runtime = the eventual replacement for all behavioral prose.
  - *Generalized:* Layer agent configuration by scope and volatility (shared-stable, machine-local, path-scoped), with the bottom layer being executable code/tests that progressively absorbs the prose layers; environment-specific facts (e.g. any LLM gateway) live only in the uncommitted local layer.
- **Minimal bootstrap, no speculative config** `preserved` `recovered`
  - Create only the minimum repository-local operating layer: a concise CLAUDE.md recording the closed decisions, a gitignored CLAUDE.local.md with observed machine facts only, and settings files only for immediately necessary settings — no pre-populated speculative permissions, agents, hooks, plugins, models, or workflows.
- **Continue directly into code** `adopted` `recovered`
  - After the bootstrap artifacts exist, the session must proceed straight into implementation — explicitly forbidden to stop with a plan, audit, recommendation, or architecture summary. The kickoff prompt also pre-forbids reopening the founding decision or proposing parallel prototypes.
- **Bounded toolchain inspection replaces capability audit** `adopted` `tension`
  - Milestone-0-style comprehensive capability auditing is deleted as a prerequisite; instead perform a short, bounded inspection of the installed toolchain sufficient to choose a viable local stack. Unknown peripheral capabilities do not block the fake-executor slice.
- **Fake-executor walking skeleton** `adopted` `north-star`
  - The smallest end-to-end slice: operator creates a bounded repository-inspection task; operator-present/away state; Repo Gardener equips the Seiri inspection mechanic; a pure kernel consumes state + event + explicit environment; virtual time reaches one pulse; kernel emits a bounded transport-neutral WorkOrder; a fake deterministic executor returns evidence-backed candidates; a separate fake verifier accepts or rejects; Operator Returned cancels future pulses; the event log replays to the identical final state.
- **First-slice hardening requirements** `preserved` `recovered`
  - Beyond the north star's kernel list, the first implementation must include duplicate-result idempotency, one simulated interruption/restart test, versioned event envelopes, command/work-order identifiers, append-only local event persistence, and a compact human-readable event timeline — concrete robustness tests baked into slice one, not deferred.
- **CLI projection fallback over environment fights** `transformed` `recovered`
  - Build a thin Angular view only if the required tooling and package access are immediately available; if Angular setup is blocked, ship kernel + simulator + tests + a minimal CLI projection rather than spending the session redesigning or auditing the environment. The view layer is optional to the vertical slice; the kernel is not.
  - *Generalized:* The vertical slice must be provable through the smallest available interface; any richer UI framework is a graceful upgrade, never a blocker, so restricted-environment machines (locked package registries, corporate proxies) can still run the full loop.
- **Deferral list for slice one** `preserved` `north-star`
  - Explicit do-not-yet list: no real Claude executor integration, no full v1 rule-corpus migration, no full RPG equipment system, no building all proposed apps/libraries, no broad agent swarm, no general autonomous-company platform, no comprehensive capability audit, no UI polish beyond proving the slice.
- **The one remaining experiment** `preserved` `recovered`
  - The open architectural question is no longer 'which of five systems builds v2' but 'how quickly can working v2 mechanisms take over responsibility from the inherited Claude rule stack without losing the competence that stack created' — an experiment that runs continuously through implementation and needs no separate planning phase.
- **Two-questions decomposition of the founding search** `raw` `recovered`
  - GPT's frame that the five paths were really answering two questions — (1) does v2 emerge directly or through an intermediate builder, and (2) is the useful intelligence inherited from v1, supplied by base Claude, or supplied by the operator — a search space that collapses once evidence exists.
- **Hand-shaping counts as hand-rolling** `preserved` `recovered`
  - The operator's selection, rejection, metaphors, operating goals, and architecture corrections constitute the hand-rolled lane; personally typing every implementation line is not required for the hand-crafted path to have run. Validates Dylan's own 'i was kind of hand crafting it still, so that was my 5th test.'
- **v1 read-only during bootstrap** `preserved` `north-star`
  - v1 is treated as strictly read-only source corpus unless explicitly authorized otherwise; the global config stays active but the v1 repo is never mutated during the v2 build.
- **Kickoff prompt as founding artifact** `preserved` `recovered`
  - A long ready-to-paste session prompt that encodes the closed decisions, repository paths, the minimal bootstrap steps, the walking-skeleton spec, and the deferral list — so the first implementation session cannot drift back into planning or relitigate the founding route. The decision is enforced by the prompt itself.
- **Settings-scope mechanics and inspection commands** `raw` `recovered`
  - Factual grounding GPT supplied: local project settings override project settings override user settings for scalars, array-valued settings (like permission rules) merge, CLAUDE.md layers concatenate rather than override, and /status plus /memory reveal which sources and instruction files are actually loaded — used to verify the bootstrap layering is real.

  *Coined terms:* **Full-context bootstrap with progressive self-hosting** — The selected founding route: build v2 with the existing global Claude / v1 environment fully active as temporary bootstrap competence, then have v2 progressively replace inherited prose rules with typed mechanisms and eventually coordinate construction of its own next slices.; **Strangler migration of the cognition/control layer** — Applying the strangler-fig pattern to Claude's rule stack: keep load-bearing v1 behavior in place while building deterministic replacements with it, retiring each prose/context dependency only after its replacement is proven.; **Migrate on contact** — Inherited global rules are classified and replaced only when one materially affects active v2 work — never via an up-front inventory of the full rule corpus, and never by copying rules wholesale into the new repo.; **Inherited Context Ledger** — A small append-as-needed table (docs/bootstrap/inherited-context-ledger.md) recording each inherited behavior in play: its source, why it is still needed, its planned v2 mechanism, evidence, and lifecycle state.; **Ledger states (inherited / identified / replacement-building / shadowing / replaced / retired)** — The lifecycle of one inherited behavior as its typed v2 replacement is built, shadow-tested alongside the prose rule, proven, and finally allows the context dependency to be retired.; **Walking skeleton** — The smallest end-to-end DotLn slice — task creation through pure kernel, virtual-time pulse, bounded WorkOrder, fake deterministic executor, separate fake verifier, cancellation, and deterministic replay — that must run before any real Claude executor is integrated.; **Bootstrap scaffolding** — The status of the current global/v1 Claude behavior in the ADR: intentionally available during construction, but not automatically part of DotLn's target runtime semantics.

## Chat 010

*Operator ask:* Dylan sent one short message asking GPT to go back through the linked previous chats and verify he is "on the right path" before starting the project, noting he intends to begin "in earnest in a few minutes." It is a final pre-flight sanity check, not new ideation from Dylan in this chat.

- **P1-P5 architecture-genesis tournament** `adopted` `tension`
  - Dylan's original five-pronged plan was a comparative experiment in architectural genesis, not a division of labor: P1 v1 directly creates v2; P2 v1 creates a builder that creates v2; P3 Claude creates v2 then self-hosts its own continued construction; P4 Claude creates a builder; P5 Dylan hand-rolls from his own judgment. Each lineage may yield a substantially different system, and comparison happens before convergence.
- **Genesis lanes vs implementation lanes distinction** `adopted` `recovered`
  - The North Star's Lanes A-E (archaeologist, clean-room architect, kernel builder, RPG builder, adversarial evaluator) divide work to implement ONE architecture; P1-P5 compare how architectures are GENERATED. Corrected founding process: Stage I architecture tournament (P1-P5), Stage II convergence (evaluator writes a synthesis ADR from first divergences and a shared executable scenario), Stage III only then use A-E as delivery topology.
- **Architecture packet deliverable** `preserved` `recovered`
  - Each tournament lane produces a bounded 'architecture packet,' not an application: premise, preservation-matrix, canonical-ir (md+json), vertical-slice, failure-model, first-30-days, tiny-executable-spec. Every packet must answer fixed questions: source of truth, deterministic vs judgmental split, what survives session death, how authority/context/tools/evidence are bounded, feedback composition, recovery from duplicate delivery / process death / VPN loss / 429, and which original ideas it preserved, transformed, rejected, or dropped.
- **Blind submissions to protect the human lineage** `preserved` `recovered`
  - Tournament submissions stay blind until complete; in particular Dylan writes the P5 hand-rolled packet BEFORE reading the model-produced conclusions, otherwise the human lane degrades into an edit of the latest model answer rather than an independent lineage. A direct anti-anchoring/anti-recency-bias mechanism.
- **Theory of Constraints applied to founding concurrency** `preserved` `north-star`
  - Because Claude capacity is the actual bottleneck, define the full tournament now but run at most one or two model lanes simultaneously — maximize flow through the real constraint, not apparent agent utilization. Also: create only the M0A and P5 worktrees now, not all five lanes.
- **Judgment compilation equation** `preserved` `north-star`
  - Compressed restatement of what the system turns human judgment into: selected attention + explicit objectives + bounded authority + composable mechanisms + deterministic decisions + nondeterministic execution + observable evidence + recoverable continuation. Reached in Dylan's raw notes via reactive programming: signals become typed events, reactions become reusable effects, and the traffic cop need not ingest every rule itself.
- **Quality boundary: kernel selects evaluators, never computes Quality** `preserved` `recovered`
  - From the Pirsig/Poincaré material: the kernel deterministically selects WHICH evaluator, evidence, exemplars, and comparison procedure apply, but never claims to calculate universal Quality itself. Irreducible judgments are recorded as evidence-bearing evaluations from multiple perspectives; disagreement is data, not something to conceal by averaging into a scalar like qualityScore: 0.84. The Evaluation type carries exemplarRefs, dissentRefs, evidenceRefs, and provenance.
- **IR as operational geometry (Poincaré conventionalism)** `preserved` `recovered`
  - The normalized IR is chosen because it is useful and convenient, not because it is the one metaphysically true decomposition of judgment. Consequences: version the IR, preserve source formulations, permit reversible migrations, distinguish canonical runtime semantics from alternate projections, never erase ideas that don't fit the current schema, and retain an explicit 'not yet representable' state.
- **Idea ledger with supersede-never-delete lifecycle** `adopted` `recovered`
  - docs/founding/idea-ledger.md as a foundational (not clerical) artifact: every idea gets an entry with id, source, original_formulation, status (raw|preserved|adopted|transformed|rejected|superseded), incorporated_by, rationale, evidence_or_experiment, supersedes. An idea may be superseded but must not disappear — the silent P1-P5 overwrite is the proof of why this is necessary.
- **AttentionPolicy as first-class, frequency demoted to caching hint** `preserved` `recovered`
  - Builds on Dylan's 'search versus store' idea but corrects it: invocation frequency alone cannot control activation because a rare catastrophic invariant outweighs a frequent prose preference. Activation priority = scope match x trigger confidence x consequence severity x evidence relevance x historical prevention value - context/tool cost. Frequency is a caching hint, never activation authority; this is a first-class AttentionPolicy, not merely retrieval search.
- **ObjectiveContract with lexicographic priorities** `preserved` `recovered`
  - The system is a tabula rasa that must be told what 'optimal' means (Dylan's source notes plus the MDP material). Start not with one weighted scalar but a lexicographic contract: desiredOutcome, hardConstraints, ordered priorities (safety > correctness > intent-fidelity > evidence > recoverability > operator-burden > throughput > resource-cost), stopConditions, escalationConditions, acceptableUncertainty. A task may override lower priorities but never silently reorder the hard ones.
- **AuthorityEnvelope as structural type, not prose** `preserved` `recovered`
  - Autonomy is an authority envelope, not a personality trait, varying with task clarity, competence evidence, reversibility, blast radius, verification strength, operator presence, and resource pressure. Deserves a real type: allowedEffects/deniedEffects patterns, resourceLimits, requiredEvidence, expiresAt, revocationEvents. 'Operator away' must never gradually widen into broader authority — the North Star says this in prose; make it structural.
- **Semantic correction events replace the profanity trigger** `preserved` `north-star`
  - The v1 'contains fuck' trigger is a flawed event predicate because Dylan uses profanity casually, analytically, humorously, and under genuine frustration. Replace with typed semantic events (OperatorCorrectionReceived, OperatorReportsRegression, OperatorRejectsUnsupportedAssumption, OperatorReportsRepeatedFailure); profanity may serve as a weak classifier feature, never the semantic event itself. Linguistic force (six levels of mitigated speech) must never be conflated with technical authority.
- **Fail-conservative correction reactor** `preserved` `recovered`
  - The reactor triggered by correction events only tightens behavior: freeze destructive authority, preserve current evidence, prohibit scope expansion, dispatch diagnosis separately, avoid apology theater, require an evidence-tied correction. Designed so a false positive makes the system MORE conservative rather than derailing it — a general design principle for reactive feedback triggers.
- **Commedia roles as optional topology with leak protection** `preserved` `north-star`
  - Whiteface/Auguste/Contra-Auguste/Watcher/Lazzo are useful party topology (status, planning, improvisation, disruption, observation) but are topology, not truth: the labels must not leak into coworker-facing language, commits, PRs, or formal semantics, and the formal roles must remain visible beneath the metaphor.
- **PoE socket-and-link as the canonical composition language** `adopted` `recovered`
  - The North Star maps RPG equipment but still treats a loadout as a bundle; the missing mechanic is PoE1's socket-and-link system as the ACTUAL composition language: active skill gem = executable workflow/reactor/capability; support gem = typed modifier affecting only linked mechanics; link group = explicit composition and scope boundary; gem tags = compatibility constraints; socket color = required capability family; trigger support = event-driven activation; mana multiplier = context/tool cost multiplier; reservation = committed persistent capacity; aura = ambient scoped policy; passive tree = durable policy graph; jewel = localized graph modifier; corruption = irreversible mutation with provenance. Must enter the founding packet before config schemas because retrofitting graph composition onto a list-based loadout will be painful.
- **LoadoutGraph and SupportFacet declaration contract** `adopted` `recovered`
  - The canonical loadout type is a graph, not a list: containers, activeMechanics, supports, links, ambientEffects, resourceModel. Every support facet must declare which tags it supports, which semantics it adds or modifies, whether it changes authority, whether it adds evidence requirements, its resource multiplier, its conflicts/exclusions, and whether the result remains deterministic — so incompatible combinations fail at compile time, patterns compose without merging their prose, and the RPG surface stops being decorative because UI and formal views describe the same graph.
- **North Star as Candidate 0, never always-loaded** `preserved` `recovered`
  - Save the generated North Star as docs/founding/north-star-candidate-0.md — a reference candidate in the tournament, not constitutional truth — and never automatically load all 827 lines into every Claude session (which would ironically make it v2's first giant always-loaded prompt, violating its own last-mile-prompt axiom).
- **M0A/M0B milestone split: timeboxed capability gate** `transformed` `recovered`
  - Split the huge capability audit: M0A is a blocking 30-60 minute capability gate producing only two files (capability-gate.md/.json) answering which settings sources load, which model/gateway/effort are actually observed, which session mechanisms (print, subagents, workflows, background, worktrees) really function, Playwright/SQLite/localhost availability, where state persists, and what survives interruption. M0B, the full audit, comes later. Unknowns remain unknown; do not deliberately manufacture a 429.
  - *Generalized:* Before committing to any architecture assumption, run a minimal, timeboxed empirical gate that verifies what the local model runtime/provider actually supports, rather than trusting public product documentation or vendor assumptions.
- **Zero-token static discovery before model spend** `transformed` `recovered`
  - A shell script captures OS, git, runtimes, SQLite, and Claude CLI surface (version, auth, doctor) costing no model tokens; then a safe-mode baseline observation (/status, /model, /context) before the single bounded M0A model session launched with --setting-sources project,local to exclude vestigial user-level customization.
  - *Generalized:* Probe the environment with deterministic scripts and read-only observations first; spend constrained model budget only on the synthesis step that requires judgment.
- **Epistemic claim classification vocabulary** `preserved` `recovered`
  - Every capability claim in discovery must be classified as one of: observed, locally documented, available but untested, blocked, not found, ambiguous — and 'unknown is an acceptable result.' Prevents inferring model, context size, or limits from public documentation.
- **Transport-neutral worker dispatch (WorkOrderTransport)** `preserved` `tension`
  - The first vertical slice must not presume Playwright as the worker transport when capability discovery is supposed to determine it. Define WorkOrderTransport { dispatch(order): Promise<CommandReceipt> } with later adapters: claude-cli-print, claude-background-session, claude-subagent, claude-workflow, agent-sdk, human-ui, fake. Playwright is demoted to what it is good at: browser effects, semantic DOM verification, screenshot evidence, testing the Angular projection, simulating a browser-bound worker — not the universal task bus.
- **EventEnvelope identity, commandId, and outbox protocol** `preserved` `recovered`
  - Events need an envelope (schemaVersion, eventId, type, occurredAt, actorId, workstreamId, episodeId, correlationId, causationId, payload) and every command a stable commandId. Outbox protocol: kernel decides; event+trace+continuation+command persist; adapter receives the persisted command; result correlates to commandId; duplicate delivery is ignored deterministically; a missing result leaves a recoverable pending command; restart reconstructs state via replay.
- **Failure-injection test matrix as the first tests** `preserved` `recovered`
  - The first tests target: crash after command persistence but before dispatch; crash after effect execution but before result persistence; duplicate result event; result arriving after authority expiry; operator return while a cadence event is queued; network interruption mid-episode. Without these, 'offline-capable and recoverable' remains a slogan.
- **Markdown as projection, JSONL-to-SQLite persistence progression** `preserved` `recovered`
  - A shared Markdown file is acceptable bootstrap transport but never canonical state — multiple agents editing one document yields lost updates, ambiguous ordering, malformed partial writes, difficult replay, and accidental model-authored truth. Progression: append-only JSONL event log for the pure prototype, SQLite once transactionality and the outbox matter, Markdown regenerated as a human-readable projection.
- **Custodian village with promotion gate** `preserved` `recovered`
  - Dylan's 'village' idea — each transformer has a custodian that observes outcomes and improves it — is kept but bounded: custodian observes, proposes a new version, runs regressions/counterfactuals, an evaluator compares versions, and a policy promotes or rejects. No silent in-place behavioral drift; the North Star's versioned-identity rule is extended to patterns, transformers, triggers, and evaluators.
- **Corpus hygiene: sanitized/fixtures/manifests split** `transformed` `recovered`
  - Never copy raw v1 transcripts, images, private URLs, credentials, or internal identifiers into GitHub merely because the repo is private. Structure: corpus/sanitized (git-eligible), corpus/fixtures (minimized regression cases), corpus/manifests (hashes, provenance, retention metadata), plus an ignored optionally-encrypted .local-corpus. Preserves the generative value of verbatim incidents locally while committing only sanitized fixtures and stable source hashes.
  - *Generalized:* Split the corpus into a private raw layer and a committable sanitized layer joined by provenance hashes, so verbatim incident value survives without leaking any employer or personal material into version control.
- **DotLn as product, Claude as one executor adapter** `adopted` `north-star`
  - The repo and ontology must center DotLn, not Claude: dotln/ with runtime/executors/claude/, runtime/executors/human/, runtime/executors/fake/ rather than a claude-prefixed v2 namespace and runtime/claude. 'v1' remains provenance and migration history; it does not determine the product ontology.
- **Concrete ten-rule mechanism classification** `preserved` `north-star`
  - A worked table mapping ten real v1 feedback rules to their correct minimal mechanisms: never-coauthor becomes an attribution setting plus commit hook; verify-cwd becomes a pre-effect Git guard; concurrent-worktrees becomes a dispatcher invariant; American spelling becomes a deterministic transformer; correctness-over-sycophancy becomes an evaluator plus policy invariant; anti-oscillation becomes decision lineage and a supersession guard; never-push-or-PR becomes a repo- and work-order-scoped AuthorityEnvelope rather than a global rule; UI verification becomes an evidence policy; under-pressure-dispatch-first becomes the semantic correction reactor plus an incident regression test; a model-specific rule is retired as precedent with provenance preserved. First proof that v2 actually reduces startup context.
- **Clean-room Claude settings hygiene** `raw` `recovered`
  - Committed .claude/settings.json carries only: empty commit/PR attribution, autoMemoryEnabled false (preventing a second invisible memory system from accumulating before DotLn defines its own persistence policy), and deny-reads on .env/secrets. Model, effort, allowlists, hooks, v1 agents/skills, and inherited rules stay out until verified. Caveat: in Git worktrees Claude Code reads local settings from the main checkout's root, so per-lane authority or model policies need per-launch flags or lane profile files, not settings.local.json.
- **Tiered model assignment with no fallback** `transformed` `north-star`
  - Model/effort spend is matched to phase: no model call for static inspection; cheapest verified schema-reliable model at high effort for M0 synthesis; strongest verified model at xhigh for P3/P4 architecture; max/ultra for one bounded convergence run only. No fallback model: a failed required-model invocation queues, stops, or reports inability rather than silently changing the experimental condition.
  - *Generalized:* Treat model identity as an experimental variable: assign the cheapest sufficient verified model per phase and never substitute silently on failure, because substitution corrupts the experiment and the evidence.
- **Narrow commit-msg attribution hook** `raw` `recovered`
  - A commit-msg hook rejects Claude/Anthropic co-author and 'Generated with Claude Code' attribution as defense in depth, but deliberately does not reject every occurrence of the word 'Claude' since a legitimate commit may be titled 'docs: record Claude gateway capabilities.' A lesson in writing precise predicates rather than broad string matches.
- **Minimal founding baseline, deferred package tree** `preserved` `recovered`
  - Create only README, CLAUDE.md, settings, hooks, docs/founding + discovery + decisions, work-orders, tooling/claude, and the corpus split; commit and tag v0.0.0; open only the M0A and P5 worktrees. Do NOT scaffold the proposed apps/libs/patterns/runtime/persistence tree yet — 'that is an architectural projection, not proof that every boundary deserves a package.' A minimal CLAUDE.md operating contract (execute only the current work order, verify pwd before Git, preserve ideas in the ledger, no authority expansion) is the only auto-loaded prose.
- **P5 seven first-class concepts** `preserved` `recovered`
  - The hand-rolled P5 packet must at minimum define seven first-class concepts before other architectures anchor Dylan: ObjectiveContract, AuthorityEnvelope, AttentionPolicy, LoadoutGraph, FeedbackUnit, EventEnvelope, WorkOrder. P5's purpose is to encode the system that feels mechanically faithful to Dylan's judgment, not to solve every rule or business book.
- **Shared tournament scenario with interruption survival** `preserved` `north-star`
  - The one common scenario all five packets must handle: repository inspection under operator absence, using Repo Gardener + Seiri, with no deletion authority, requiring evidence and independent verification, and SURVIVING A PROCESS INTERRUPTION — the crash-survival clause being the addition over the North Star's vertical slice.
- **Corrected vertical slice with idempotency steps and projective UI** `preserved` `north-star`
  - The post-convergence walking skeleton adds to the North Star slice: the Seiri active mechanic explicitly LINKS to support facets (repo-scope bound, read-only, evidence capture, no deletion, independent verification); duplicate result delivery is tested; a simulated crash/restart replays to the same state; and five views (RPG, function-table, statechart, raw-IR, timeline) project the same trace. The UI arrives early because understanding work in flight is a core operator need, but the Angular application must project the controller's state — it must not become the state.
- **Feedback units are mechanisms, not resident agents** `preserved` `north-star`
  - Endorsing the North Star's mechanism-selection hierarchy, GPT sharpens how 'agentize the feedback' should work: every feedback unit has an active mechanism, but most feedback units should NOT become continuously running LLM agents — the reactive mechanism is the agent-like part; the LLM is invoked only where judgment is irreducible.

  *Coined terms:* **Candidate 0** — The generated North Star saved as docs/founding/north-star-candidate-0.md — one candidate architecture among the tournament entries, a reference artifact rather than constitutional truth, and never auto-loaded into every session.; **Architecture tournament (Stage I)** — Running the five genesis lineages P1-P5 against the same bounded problem and scorecard, each producing an architecture packet, with submissions kept blind until complete.; **Architecture packet** — The bounded deliverable of one tournament lane: premise, preservation-matrix, canonical IR (md+json), vertical slice, failure model, first-30-days plan, and a tiny executable spec — explicitly not a complete application.; **Idea ledger** — A foundational registry (docs/founding/idea-ledger.md) where every idea has id, source, original formulation, and a lifecycle status (raw/preserved/adopted/transformed/rejected/superseded); an idea may be superseded but must never disappear.; **M0A capability gate / M0B capability audit** — M0A is the blocking, 30-60 minute timeboxed discovery step producing exactly two files answering which capabilities are actually observed; M0B is the deferred full-breadth capability audit.; **Operational geometry** — The stance (from Poincaré) that the normalized IR is chosen for usefulness and coherence, not because it is the one metaphysically true decomposition of judgment — hence versioning, reversible migrations, and a 'not yet representable' state.; **AttentionPolicy** — A first-class policy computing activation priority as scope match x trigger confidence x consequence severity x evidence relevance x historical prevention value minus context/tool cost; invocation frequency is only a caching hint, never activation authority.; **ObjectiveContract** — A typed, lexicographic definition of 'optimal' for a task: desired outcome, hard constraints, ordered priorities (safety first), stop conditions, escalation conditions, and acceptable uncertainty; lower priorities may be overridden per task, hard ones never silently reordered.; **AuthorityEnvelope** — A structural type bounding an actor's autonomy: allowed/denied effect patterns, resource limits, required evidence, expiry, and revocation events — replacing prose autonomy rules and preventing operator absence from widening authority.; **LoadoutGraph** — The canonical loadout as a graph rather than a list: containers, active mechanics, support facets, explicit links, ambient effects, and a resource model — the DotLn rendering of PoE socket-and-link composition.; **Support facet** — The DotLn analog of a PoE support gem: a typed modifier affecting only linked active mechanics, which must declare supported tags, modified semantics, authority changes, evidence requirements, resource multiplier, conflicts, and whether determinism is preserved.; **Link group** — The explicit composition and scope boundary joining active mechanics with support facets — the analog of PoE linked sockets.; **WorkOrderTransport** — A neutral dispatch interface (dispatch(order) -> CommandReceipt) so the worker mechanism (CLI print, background session, subagent, workflow, SDK, human UI, fake) is an adapter chosen empirically, not presumed.; **EventEnvelope** — The identity wrapper every event needs: schemaVersion, eventId, type, occurredAt, actorId, workstreamId, episodeId, correlationId, causationId, payload — enabling idempotency, correlation, and replay.; **Apology theater** — Performative apologizing by a model under criticism, named as a behavior the correction reactor must explicitly avoid in favor of evidence-tied correction.; **Fake executor** — A deterministic stand-in executor that runs the complete scenario end-to-end before any real Claude integration, making the walking skeleton testable without model calls.; **P1-P5 vs Lanes A-E** — P1-P5 are competing architectural genealogies (v1-direct, v1-builder, Claude-self-hosting, Claude-builder, human hand-rolled) run before convergence; A-E are complementary implementation lanes (archaeology, stewardship, kernel, UI, adversarial evaluation) used only after convergence.

## Chat 009

*Operator ask:* Dylan declared the ideation phase done ("a treasure trove of amazing ideas") and asked for the actual commands: he has an empty GitHub repo, is over his Claude budget, and wants to bootstrap the new project from scratch ("from jumpstreet") with only vestigial global settings on his Mac profile, plus local Claude settings (model params, no Claude commit authoring, worktrees). He wants progress that consumes zero main-thread context — or no Claude at all, with GPT feeding him commands or entire pages to type himself — one step at a time, under a clear vision with milestones, versions, and explicit ability to pivot when real data, constraints, or new ideas arrive.

- **zero-model-bootstrap** `adopted` `recovered`
  - The first milestone (v0.0.0) establishes the control plane, context boundary, version ladder, and capability audit entirely with shell commands — no interactive Claude session, no model request. Motivated by budget exhaustion and by refusing to spend main-thread context on setup.
- **canonical-launch-shape** `adopted` `recovered`
  - A named recipe for every future worker invocation: fresh bounded invocation + project/local settings only + auto memory disabled + isolated worktree + explicit model and effort + no session persistence + compact structured result; concretely `claude -p --setting-sources project,local --no-session-persistence --worktree --model --effort --output-format json` fed a bounded work-order file. The north star wants disposable episodes but never pins this concrete flag-level shape.
- **minimal-committed-settings** `adopted` `recovered`
  - The committed .claude/settings.json carries exactly three controls (autoMemoryEnabled false, includeGitInstructions false, attribution blanked) and deliberately omits model, effort, permissions, hooks, MCP, agents, and workflows until capability discovery — so no product assumption gets baked in prematurely.
- **tiny-session-contract** `preserved` `recovered`
  - A six-rule always-loaded CLAUDE.md ('DotLn Session Contract'): work only from the bounded work order; main checkout is control plane; never touch config unless authorized; no AI attribution; never infer completion from prose — satisfy evidence gates; return a compact structured result, persist the continuation externally, stop. Explicit warning: 'Do not turn this into v1 again.' The rules exist in the north star as axioms; the mechanism of one tiny always-on contract is new.
- **attribution-defense-in-depth** `preserved` `recovered`
  - Suppress Claude attribution via settings AND install a deterministic commit-msg git hook that independently rejects Co-Authored-By Claude, 'Generated with Claude', and session URLs — protection that survives config drift, gateway wrappers, or model behavior changes. A concrete specialization of 'hard constraints live outside the model'.
- **design-lineage-taxonomy** `adopted` `recovered`
  - An append-only conceptual lineage where every material design idea receives one typed relationship to existing ideas: foundation, extension, formalization, projection, specialization, supersession, or experiment. North Star changes require originating evidence, affected prior ideas, relationship type, expected benefits, new failure modes, and a reversible experiment when practical.
- **anti-recency-axiom** `adopted` `recovered`
  - Elevated to a governing principle in the generated North Star: 'New ideas extend or explicitly supersede earlier ideas. They do not erase them through recency.' A recent idea never silently replaces an older accepted one. Directly answers Dylan's demand for pivot-ability without idea loss.
- **semver-ladder-with-pivot-points** `adopted` `north-star`
  - The milestone sequence becomes a semver version ladder with per-version exit criteria: v0.0.0 clean-room bootstrap, v0.0.1 capability truth, v0.1.0 deterministic kernel, v0.2.0 isomorphic vertical slice, v0.3.0 disposable real worker, v0.4.0 independent verification, v0.5.0 ticket-to-PR path, v1.0.0 teammate-ready — with pivots gated on evidence at each rung. Restates the north star's milestone sequence with added versioning and exit-criteria discipline.
- **capability-truth-before-framework** `adopted` `north-star`
  - No framework, package, model, or orchestration topology is selected until the actual machine's evidence exists: installed Claude version and flags, accepted model identifiers, effort controls, setting-source behavior, subagent/workflow/worktree support, MCP and Playwright availability, structured-output support, and 429/gateway recovery behavior.
- **zero-token-privacy-audit-script** `preserved` `recovered`
  - audit-claude-surface.sh inspects the environment using only local version/help commands (never a prompt), and records environment-variable NAMES never values, startup-context file line/byte metadata never contents, and symlink paths without reading targets, into timestamped run directories with a `latest` symlink. The north star's Milestone 0 wants capability truth; this metadata-only, zero-token mechanism is new.
- **human-transport-protocol** `transformed` `recovered`
  - The operator himself is the transport across the trust boundary between two isolated environments: commands or whole pages are relayed by hand rather than by any direct connection, and only a bounded, sanitized result summary comes back (no settings contents, credentials, env values, gateway URLs, or tokens) — and that pasted output alone drives the next milestone decision.
  - *Generalized:* The human operator is an explicit effect adapter/transport across any trust or network boundary: commands cross in as typed artifacts, evidence crosses back as sanitized structured result envelopes, and the planner acts only on those envelopes.
- **startup-context-accounting** `preserved` `north-star`
  - Measure everything that loads at session start — global and project CLAUDE.md files, rules directories, auto-memory MEMORY.md indexes — by line/byte metadata, so the always-loaded footprint is a tracked, budgeted quantity rather than an accident.
- **auto-memory-as-liability** `preserved` `recovered`
  - Claude's project auto-memory feature is explicitly disabled so no accumulated memory index silently loads into fresh sessions; external memory must be deliberate (event store, docs), never ambient product memory. Distinct from the north star's 'external memory beats transcript memory' — this treats the product's own memory feature as a context contaminant.
- **discovery-quarantine-promotion** `preserved` `recovered`
  - Generated machine-local discovery output lives in gitignored .dotln/discovery/; only sanitized conclusions and evidence appropriate for source control are later promoted into version-controlled docs/discovery. A two-tier raw-vs-promoted evidence flow.
- **bootstrap-commit-first** `preserved` `recovered`
  - Worktree sessions require at least one Git commit, so the clean-room bootstrap commit is a hard prerequisite for the whole worktree-isolated execution model — a concrete ordering constraint on day one.
- **deliberate-non-configuration-list** `preserved` `north-star`
  - An explicit enumerated list of what NOT to configure yet (model, effort, permission mode, tool allowlists, background sessions, agents, workflows, MCP, Playwright, hooks, Nx/Angular/NgRx/XState/PrimeNG, database) so that no current Claude product feature becomes a permanent architectural premise.
- **clean-room-adr** `adopted` `north-star`
  - ADR 0001: DotLn starts in a clean repository and inherits zero v1 runtime configuration; v1 remains source corpus, behavioral evidence, and a migration benchmark. Early progress is deliberately small and reversible, and prior ideas survive through the design lineage rather than being silently replaced.
- **concise-north-star-vs-corpus-split** `preserved` `north-star`
  - The committed North Star is kept deliberately concise while the larger source corpus grows separately 'without entering every model invocation' — the vision document and the model-context payload are decoupled artifacts.
- **managed-settings-authority-caveat** `transformed` `recovered`
  - Centrally managed settings can still apply even when user-level setting sources are excluded via flags; the locally installed binary and the managed policy are authoritative over public product documentation. Verify what flags the actual binary accepts before relying on them.
  - *Generalized:* Treat the deployment environment's policy layer as an authoritative override the orchestrator must discover and respect; never assume documented public behavior survives a wrapped or managed installation.
- **noninteractive-worktree-cleanup** `preserved` `recovered`
  - Noninteractive worktree sessions never receive the interactive exit prompt, so worktree cleanup and recovery must be explicit and deterministic — surfacing as the 'deterministic cleanup and recovery' exit criterion on the disposable-worker milestone.
- **worker-config-mutation-prohibition** `preserved` `recovered`
  - A standing episode invariant: never change user, gateway, credential, MCP, hook, or Claude configuration unless the work order explicitly authorizes it — configuration mutation is itself a gated capability, not an ambient right.
- **400k-startup-failure-diagnosis** `preserved` `north-star`
  - The quantified v1 failure mode: a fresh session began around 400,000 tokens, after which rules could be confused, activated incorrectly, or forgotten at the critical moment. This number is the empirical justification for the whole context-boundary discipline.
- **ticket-to-pr-vertical** `transformed` `recovered`
  - v0.5.0 delivers the work pipeline: ticket source capture with rich text and images, explicit story contract, repository and live-app analysis, Angular implementation, independent verification and review, and evidence-grounded PR creation and monitoring.
  - *Generalized:* A pluggable external-ticket-to-verified-PR flow (faithful source capture, explicit contract, investigation, implementation, verification, evidence-grounded PR) as one vertical the kernel can host — present in the ladder but not a kernel dependency.
- **main-checkout-as-control-plane** `preserved` `north-star`
  - The main repository checkout is the control plane; model-authored repository changes belong exclusively in isolated worktrees. A crisp spatial separation between orchestration state and executor output.
- **teammate-ready-v1-definition** `preserved` `north-star`
  - v1.0.0 is defined as: a teammate can declare a bounded intent and receive a verifiable result without learning DotLn internals or accumulating a giant model transcript — the coworker promise turned into a version gate.

  *Coined terms:* **clean-room bootstrap** — Milestone v0.0.0: establishing DotLn in an empty repository with zero inherited v1 runtime configuration and zero model calls, using only shell commands.; **launch shape** — The canonical recipe for a worker invocation: fresh bounded invocation + project/local settings only + auto memory disabled + isolated worktree + explicit model and effort + no session persistence + compact structured result.; **capability audit / audit-claude-surface** — A zero-model local inspection script that captures installed tool versions, Claude CLI flag surface, env-var names (never values), and startup-context file metadata (never contents) into timestamped discovery output.; **Capability Truth** — Milestone v0.0.1: determining from the actual machine what Claude Code, the gateway, and the toolchain really support before any framework or orchestration decision is made.; **DotLn Session Contract** — The tiny six-rule always-loaded CLAUDE.md that governs every session: bounded work orders only, worktree isolation, no config mutation, no attribution, evidence gates over prose, compact structured results with external continuations.; **design lineage** — An append-only conceptual history where every material design idea is typed by its relationship to prior ideas — foundation, extension, formalization, projection, specialization, supersession, or experiment — so recency never silently erases accepted ideas.; **evidence gates** — The work order's required evidence conditions; completion is satisfied only by meeting them, never inferred from a model's prose claims.; **discovery (.dotln/discovery)** — Gitignored machine-local generated audit output; only sanitized conclusions are promoted into version-controlled docs.; **main thread context needle** — Dylan's phrase for cumulative context consumed by the primary interactive Claude session; the goal is bootstrap and setup work that does not move it at all.; **vestigial global settings** — Dylan's phrase for the few leftover global Claude settings on his Mac profile that the otherwise clean-room new repo would still inherit.; **from jumpstreet** — Dylan's phrase meaning from the very beginning — the new repo must be used cleanly from the first command onward.; **teammate-ready** — The v1.0.0 bar: a teammate declares a bounded intent and receives a verifiable result without learning DotLn internals or accumulating a giant transcript.

## Chat 008

*Operator ask:* Dylan shared a screenshot of a personal experiment he built 5-10 years ago — emoji glyphs manipulated with Tailwind CSS (opacity, sepia, invert, blur, rotate, reflect, scale, shadow) — and asked whether it is helpful for the DotLn UI. It is a tentative, exploratory offer ("idk if this is helpful... thoughts?"), not a directive.

- **Emoji + CSS manipulation as agent UI medium** `adopted` `recovered`
  - Dylan's own 5-10-year-old experiment: emoji glyphs layered with Tailwind CSS filters/transforms (opacity, sepia, invert, blur, rotate, reflection, scale, shadow) as a manipulation playground. He resurfaced it himself as a possible foundation for the DotLn UI.
- **CSS modifiers as visual support gems** `preserved` `recovered`
  - A base glyph with composable, reorderable CSS treatments is a visual functional program — rotate(blur(invert(opacity(base)))) — directly paralleling PoE skill+support gem links. The same socket-link UI that composes behavior can visibly compose appearance.
- **Pure visual projection of canonical state** `preserved` `north-star`
  - The CSS never decides agent behavior; canonical DotLn state decides, and a pure function (projectAgentVisual(agentSnapshot)) renders it. This makes the animated display trustworthy — a concretization of the north star's projective-interfaces layer applied to per-glyph visuals.
- **Visual grammar: CSS treatment → operational meaning** `preserved` `recovered`
  - A standard mapping table: reduced opacity = dormant/deprioritized; near-transparency = counterfactual/speculative/historical; blur = uncertain/stale/outside attention radius; red silhouette = blocking failure; sepia/grayscale = deprecated/archived; inversion = adversarial/opposing stance; rotation = phase change; horizontal reflection = semantic opposite; vertical reflection = failure/death; glow = urgency/authority; faded copies = fan-out/lineage; scale = escalation; blur+motion = work in transit.
- **Visual encodings for session lifecycle** `preserved` `recovered`
  - Upside-down glyphs mean worker crashed / session died / verification failed / adapter unavailable; ghosted copies mean prior incarnations, pending continuations, alternative candidates, or counterfactual branches. Visual vocabulary for the episode/incarnation and lineage concepts the north star already defines.
- **Emoji triple as event-chain narrative** `raw` `recovered`
  - The caterpillar → fire → ambulance sequence reads as subject → incident → responder, i.e. an emoji row can encode an event chain narratively.
- **PatternDefinition with bundled projections** `preserved` `north-star`
  - Each pattern carries one behaviorTransform plus multiple projections (explanation, visual, statechart, code) so the RPG animation, tooltip, statechart, and code all originate from the same pattern object. A concrete API shape for the north star's isomorphic-representations requirement.
- **Animation is lossy; click exposes mechanics** `preserved` `north-star`
  - Animation is acknowledged as a lossy projection, so clicking any animated element must always expose the exact underlying mechanics (a 'mechanics inspector'). Direct application of the axiom that every pattern must reveal its mechanics.
- **Emoji as zero-cost prototyping medium** `preserved` `recovered`
  - Native emoji provide characters, tools, hazards, buildings, statuses, factions, and resources offline with near-zero art cost, letting DotLn feel alive and validate the entire RPG interaction language (via emoji layers, CSS filters/transforms/masks, pseudo-elements, SVG socket links, small deterministic animations) before any custom sprite pipeline exists.
- **Living magnetic index cards** `preserved` `recovered`
  - Each visible object behaves like a movable magnetic LED index card (Dylan's earlier whiteboard idea) but can additionally pulse, change stance, equip supports, become transparent, split into workers, leave ghosts, link to other agents, display timers, react to real events, and replay prior state. Bridges the physical-card metaphor (north star axiom 1) into an animated digital UI.
- **Visual transmog / skin system** `preserved` `recovered`
  - Support visual reskinning from the start: multiple renderers (Native Emoji, DotLn Glyphs, Custom SVG Minis, Red Panda Workshop, Transforming Robots, Commedia Stage, Plain Professional, Developer/Diagnostic) all consuming the same renderer-agnostic VisualSpec, with native emoji as renderer number one and a locked SVG set later for cross-platform consistency without domain-model changes.
- **AgentVisualSpec interface** `preserved` `recovered`
  - A typed, renderer-agnostic description of an agent's appearance: baseActor, equipment[], statuses[], links[], aura, activity, opacity, orientation, motion. The contract that decouples domain state from any particular skin.
- **Semantic supports vs cosmetic projections** `preserved` `recovered`
  - Two distinct categories: semantic supports alter real behavior (Evidence-Bound, Proposal-Only, Independent Verification, Operator-Away Trigger) while cosmetic projections merely communicate that behavior (shield glow, lock overlay, moon badge, stuttering cadence). The user equips 'Evidence-Bound', not 'blue glow' — the glow is just the current skin's expression.
- **Typed GlyphVisualState over Tailwind class strings** `transformed` `recovered`
  - Never store arbitrary Tailwind class arrays in canonical domain state (couples the behavioral model to one renderer); instead keep a typed GlyphVisualState (opacity, rotationDeg, scaleX/Y, blurPx, saturation, glow enum, animation enum) applied via CSS custom properties. Tailwind/PrimeNG handle page chrome (layout, panels, drawers, forms); a small DotLn visual engine handles composable glyph mechanics.
  - *Generalized:* Framework-neutral: keep visual state as typed data in the domain, bind it to presentation via CSS variables in whatever component framework is in use; reserve utility-CSS frameworks for application chrome only.
- **Event-replay timeline scrubber UI** `preserved` `recovered`
  - Because visual state is a pure projection of an event-sourced snapshot, the entire interface can be replayed: a timeline scrubber animates characters spawning/despawning, ghosts of prior incarnations, links lighting up, supports activating, failed sessions flipping or fading, work products traveling, blocked workers freezing, continuations shown as unfilled paths, and the Watcher narrating at the edge — answering 'what is DotLn doing?' without reading transcripts.
- **Motion means transition** `preserved` `recovered`
  - Animation-economy rule: motion signals transitions (new event, state change, handoff, approaching deadline, blocked worker, cadence pulse, newly activated support, failure needing attention); stable state becomes visually calm. Never animate every idle agent forever — prevents an adorable screen where everything jiggles and nothing is legible.
- **Accessibility as first-class visual constraint** `preserved` `recovered`
  - Honor prefers-reduced-motion, mark decorative glyphs aria-hidden, and give every visual state a textual/status equivalent (sr-only accessible description) — visual encodings must never be the only channel for state.
- **Native emoji limitations** `raw` `recovered`
  - Emoji differ across OS/font stacks, have inconsistent proportions and baselines, recolor unpredictably, can be multi-code-point, may be announced distractingly by screen readers, and can read as too playful for a professional internal audience — the argument for the transmog abstraction rather than emoji as the permanent identity.
- **First visual spike spec** `preserved` `recovered`
  - Smallest useful prototype: one base actor emoji, one work-object emoji, one hazard/status emoji (e.g. 🐛 Repo Gardener, 🔥 defect/entropy, 🚑 repair/verification responder), six support sockets, one link group, eight CSS visual transforms, one event replay slider, one mechanics inspector — with the same event sequence rendered simultaneously as emoji scene, RPG loadout, statechart, function-table row, and raw event list. A concrete, cheaper concretization of the north star's Lane D / Milestone 2.
- **Emoji experiment as prior art for Dylan's own thinking** `raw` `recovered`
  - GPT's observation that Dylan was already composing transformations over a stable primitive and exploring the resulting state space years before having agent-system vocabulary — the demo is 'visual prototype zero', evidence the composable-modifier UI is native to how Dylan thinks rather than an imported metaphor.

  *Coined terms:* **visual support-gem system** — Composable CSS modifiers applied to a base glyph, treated as the visual analog of PoE skill/support gem links: reusable, reorderable, comparable transforms over one stable primitive.; **visual prototype zero** — GPT's name for Dylan's old emoji+Tailwind demo — the earliest working prototype of DotLn's visual language, predating the agent-system vocabulary.; **transmog** — Swappable visual skins (Native Emoji, Custom SVG, Red Panda Workshop, Plain Professional, Developer/Diagnostic, etc.) that all consume the same renderer-agnostic VisualSpec, so appearance can change without touching the domain model.; **semantic supports** — Equipped supports that alter real agent behavior (Evidence-Bound, Proposal-Only, Independent Verification, Operator-Away Trigger).; **cosmetic projections** — Skin-level visual expressions that only communicate behavior (shield glow, lock overlay, moon badge, stuttering cadence); the user equips the semantic support, never the cosmetic effect.; **AgentVisualSpec / VisualSpec** — Typed renderer-agnostic description of an agent's appearance: baseActor, equipment, statuses, links, aura, activity, opacity, orientation, motion.; **GlyphVisualState** — Typed visual state (opacity, rotationDeg, scaleX/Y, blurPx, saturation, glow enum, animation enum) kept in the domain instead of Tailwind class strings, bound to rendering via CSS custom properties.; **Motion means transition** — Animation-economy rule: animate only events, transitions, handoffs, deadlines, blocks, pulses, and failures; stable state stays visually calm.; **mechanics inspector** — The click-through affordance guaranteeing that any lossy animated projection exposes the exact underlying mechanics on demand.

## Chat 007

*Operator ask:* Dylan grounds the project in real tracked work: given a ticket-system user story or defect for an internally maintained application (with API access for the assistant, image OCR, and the ability to decode color coding/strikethroughs in imperfect stories), he wants GPT to walk the ENTIRE cycle — repo + story in, staff-level work, all the way through PR. He also coins the shortened name "DotLn" in this message.

- **DotLn name coined** `adopted` `recovered`
  - Dylan shortens 'Days of the Natural Logarithm' to 'DotLn' in this chat — the project's naming moment, replacing the earlier working title.
- **Ticket-to-verified-PR promise** `transformed` `recovered`
  - One production promise: repo + ticket artifact + authority profile in → scoped, implemented, independently verified PR out, interrupting the operator only for genuinely material decisions. All the RPG/statechart/episode machinery exists to make this loop reliable.
  - *Generalized:* Any tracked-work artifact + registered repo + named authority preset compiles to a verified PR (or equivalent deliverable) with material-decision-only interruption.
- **Named authority profiles** `preserved` `north-star`
  - Authority invoked by name ('Normal Angular story authority') expanding to an explicit allowed/prohibited operation list (worktree/edit/test/Playwright/push/PR yes; merge/deploy/prod-mutation/cross-repo no), echoed back as a receipt. Refines the north star's Role/autonomy-envelope into a reusable invocation shorthand.
- **Fire-and-forget receipt invocation** `preserved` `recovered`
  - Operator types four lines; DotLn replies with one compact receipt (workstream id, repo+base commit, captured source revision, authority checklist, current state, 'operator input required: none') and the operator walks away. The receipt is the whole synchronous interaction.
- **Terminal as complete control surface** `adopted` `north-star`
  - The terminal front door and the browser UI both invoke the same commands against the same state machine; the UI is explicitly 'not a second implementation of the workflow'. Extends the isomorphic-interfaces pillar to the CLI/GUI split.
- **RepoProfile + repository archaeologist** `transformed` `recovered`
  - One-time read-only registration builds a typed RepoProfile (commands, versions, architecture patterns, branching/PR policy, environment authority, local-app startup, Playwright-safe environments), drafted automatically and confirmed only where a consequential fact cannot be derived.
  - *Generalized:* Per-repo typed capability/convention profile discovered by a read-only archaeologist; all later commands come from the profile, not a globally invented standard.
- **Repo-native principle** `transformed` `recovered`
  - Never impose 'latest best practice' over an established repository: 'repo-native' means the current codebase's deliberate architecture, adjusted only with clear reason. Guards against model-fashionable rewrites.
  - *Generalized:* Convention authority resides in the target codebase's demonstrated architecture, not in the model's training-set preferences.
- **Immutable SourceBundle with credential hygiene** `transformed` `recovered`
  - The source adapter captures an immutable snapshot (metadata, raw formatted HTML, discussion, revision history, full-resolution images) with provenance; the API credential lives only in the native adapter/secret store and is never written into a prompt, workstream file, log, or repo.
  - *Generalized:* Ticket-system adapters capture immutable, provenance-carrying snapshots; secrets stay in adapters and never enter model context or persisted artifacts.
- **Rich-text semantics retention** `transformed` `recovered`
  - Source is not prematurely flattened to plain text: strikethrough state, foreground/background color, emphasis, list nesting, table cells, image position, and the revision in which content appeared are all retained as data because they carry requirement meaning.
  - *Generalized:* Formatting is semantics: any formatted source is ingested with its visual/structural markup preserved as typed evidence, not stripped.
- **Per-artifact convention inference** `adopted` `recovered`
  - No global rule like 'red means rejected' — coworkers use colors inconsistently. The Story Interpreter infers each artifact's own formatting convention from local context, discussion entries, repeated formatting, revision history, image annotations, and any explicit legend.
- **Image evidence model, OCR as aid** `adopted` `recovered`
  - Each image keeps original file, dimensions, visual interpretation, OCR text with bounding regions, detected arrows/boxes/highlights/strikethroughs, and relation to nearby text. OCR is an extraction aid, not source of truth: OCR-vs-visible discrepancies are recorded, never silently resolved.
- **Source revision guard** `transformed` `recovered`
  - DotLn keeps watching the ticket's revision; a material update later in the cycle invalidates the affected plan or evidence instead of letting the PR proceed against a stale story. Compiled as an affix-level guard ('Source Revision Guard').
  - *Generalized:* Upstream-source change detection that invalidates exactly the downstream plan/evidence derived from the changed portion.
- **StoryContract compiler** `adopted` `recovered`
  - A fresh task-scoped Story Interpreter turns the imperfect artifact into a typed StoryContract: purpose, current/desired behavior, acceptance criteria, examples, constraints, non-goals, assumptions, open questions, pinned source revision. It receives only the SourceBundle — not the repo or the feedback library.
- **Statement classification taxonomy** `preserved` `recovered`
  - Every meaningful statement in the source is classified (explicit requirement, non-requirement, example, question, answer, obsolete/struck, visual annotation, existing-behavior observation, inference, assumption, unresolved contradiction) and every conclusion points back to its source.
- **Living acceptance-evidence matrix** `adopted` `recovered`
  - An AC matrix (exact behavior x source evidence x code surface x automated test x live evidence x status) is the operational specification that evolves through the whole workstream — not a table pasted into the PR at the end. A criterion without sufficient evidence remains incomplete.
- **Materiality-based clarification policy** `adopted` `recovered`
  - Ambiguity is first resolved from source history, current app behavior, code/tests, related stories, and repo conventions; DotLn proceeds silently when the choice is local/reversible/behavior-consistent/documentable-as-assumption, and stops only when interpretations materially change user-visible behavior, contracts, security, scope, cross-team dependencies, irreversible migrations, or ACs.
- **Decision packet** `preserved` `recovered`
  - When interruption is warranted, the operator gets a structured packet — conflict, current repo behavior, enumerated options, a recommendation with reasoning, and 'impact of waiting' (how long unrelated work can proceed). The answer becomes a versioned decision attached to the workstream.
- **Six interruption conditions + never-ask list** `adopted` `recovered`
  - Only material product ambiguity, authority expansion, architecture with future cost, missing access, contradictory evidence, or non-converging/negative-value continuation justify interrupting; questions like 'should I run the unit test / start localhost / read the attachment' are already dictated by the loadout and state machine and must never surface.
- **Repo Cartographer and ImpactMap** `preserved` `recovered`
  - A read-only worker maps entry points, components, state ownership, services/effects/selectors, shared-component consumers, existing tests, similar prior implementations, and likely change surface into a structured ImpactMap — explicitly not a giant prose repository summary.
- **Live Witness baseline reproduction** `preserved` `recovered`
  - Before changing anything, a witness runs the current base branch and reproduces the defect, preserving baseline evidence (interaction sequence, DOM state, screenshot, console, network, store state, trace); for new stories it walks adjacent screens to learn existing conventions and states. Honest non-reproduction is recorded as an environment limitation rather than faked.
- **Defect vs story dual workflow** `preserved` `recovered`
  - Two branch shapes: defect = reproduce → preserve baseline → root cause → failing regression evidence → repair; new story = understand surrounding behavior → define observable future behavior → establish tests/mocks → implement.
- **Conditional quality facet packs** `transformed` `north-star`
  - Staff-level concern catalogs (RxJS teardown/flattening, NgRx/SignalStore ownership and purity, template a11y/touch-target/handheld ergonomics) activate only when the impact map shows that surface is touched — implemented as a mix of deterministic checks, conditional reviewers, and on-demand references rather than prompt prose.
  - *Generalized:* Domain-specific quality checklists become check packs keyed to the impact map's detected code surfaces; the north star's 'activate only relevant policies' instantiated per framework.
- **Bounded plan exploration** `preserved` `north-star`
  - At most two competing approaches, and only for consequential decisions; exploration stops when the expected value of another option falls below the cost of delay. Normal output: one recommendation plus rejected alternatives with reasons.
- **PoE build compiled to zero-token mechanisms** `adopted` `north-star`
  - The link group ([IMPLEMENT STORY] + support gems + item affixes like Evidence-Bound, No Invented Requirements, Feature-Branch Only) is an inspectable projection of the exact WorkOrder; each support compiles to a different mechanism type (typed schema, evaluator, deterministic commands, browser actor, fresh episode, permission boundary) and most cost zero model-context tokens in the implementer.
- **Saved builds with auto-activated supports** `preserved` `recovered`
  - For normal work the operator never drags gems: DotLn starts from a saved 'Staff Angular UI' build and conditionally activates task-specific supports (visual defect → Visual Image Witness; shared primitive touched → Verify All Consumers; auth/URL touched → Login Verification). The loadout exists for understanding and override, not clerical work.
- **Implementer discipline checklist** `preserved` `recovered`
  - The implementer confirms branch/worktree, reproduces the expected failure where practical, makes the smallest coherent change, tests alongside code, records plan deviations, runs focused checks per slice, and reads its own diff before reporting completion; no opportunistic broad cleanup just because it noticed something.
- **Boy Scout cleanup policy** `preserved` `recovered`
  - Small adjacent cleanup is permitted only when unambiguously correct, low risk, covered by the same verification, and unlikely to obscure the story's diff; anything else becomes a separate candidate task.
- **Mocks prove client behavior only** `transformed` `recovered`
  - Use the repository's existing mocking approach (e.g. MSW); fixtures are explicitly synthetic and mapped to acceptance criteria; mocks prove client behavior under controlled inputs but never count as integration proof against a real backend.
  - *Generalized:* Evidence typing distinguishes mocked-client proof from live-integration proof; synthetic fixtures are labeled and AC-mapped.
- **Blinded independent verifier** `preserved` `recovered`
  - The Behavior Verifier receives the contract, matrix, baseline evidence, diff, and startup instructions — but NOT the implementer's persuasive narrative or internal reasoning, explicitly to reduce confirmation bias. The implementer is never allowed to certify its own work.
- **Anti-gaming verification checks** `preserved` `recovered`
  - The verifier confirms required tests genuinely execute and assert behavior rather than implementation trivia, and that no lint-disables, skipped tests, or unsafe casts were used as 'fixes'; the branch diff must match the workstream scope.
- **Claim-typed evidence mapping** `adopted` `recovered`
  - The required evidence type depends on the claim: 'button disabled' → DOM state + screenshot; 'visually struck through' → image inspection + computed style; 'API not called while invalid' → network trace; 'survives navigation' → navigation sequence + visible state. For visual defects a rendered-image check is mandatory — a DOM class assertion is not proof the user saw the right thing.
- **Verification as gate, never a question** `adopted` `north-star`
  - DotLn must never ask 'do you want me to run this on localhost?' when live verification is in the completion contract — an explicit encoding of a real past failure mode where verification degraded into an optional conversational suggestion.
- **Typed findings, fresh repair, stale evidence** `preserved` `north-star`
  - A verification failure becomes a typed VerificationFinding (severity, observed/expected, reproduction steps, evidence refs, likely surface) driving a focused repair work order in a fresh episode; after any substantive repair, affected verification evidence is marked stale and must be regenerated.
- **Behavior verification vs code review split** `preserved` `recovered`
  - Two separate independent episodes: the Behavior Verifier answers 'does it work?' while the Staff PR Reviewer answers 'is this the right implementation to maintain and ship?' (intent fidelity, root-cause vs symptom, boundaries, a11y, test usefulness). The reviewer reports findings and may not silently rewrite the branch; minor suggestions do not auto-expand scope.
- **PR generated from artifacts, not narrative** `preserved` `recovered`
  - Pre-PR checks (source-revision recheck, base divergence, secret scan, temp-artifact exclusion, history cleanup per team convention) precede a PR whose body is generated from the StoryContract, actual diff, completed acceptance matrix, and evidence — never from the implementer's unsupported summary.
- **Workplace camouflage** `transformed` `recovered`
  - No Claude, DotLn, agent, gem, RPG, or internal taxonomy language ever appears in the PR title or body — output follows the destination repository's actual conventions in normal human prose. If PR creation is disallowed by the destination's policy, DotLn produces a PR-ready package and exact command instead of bypassing the policy.
  - *Generalized:* A projection boundary: internal orchestration vocabulary never leaks into artifacts consumed outside the system, and policy limits are met with handoff packages rather than workarounds.
- **PR feedback-loop ownership** `transformed` `recovered`
  - 'Through PR' means owning the loop after opening: monitoring CI, merge conflicts, reviewers, review comments, and upstream source changes until ready-for-merge; DotLn never merges without explicit authority.
  - *Generalized:* Deliverable ownership extends past submission — the workstream monitors downstream signals (CI, human review, source drift) until a human-controlled terminal state.
- **Deterministic CI-failure classifier** `preserved` `recovered`
  - A deterministic classifier first distinguishes code/test failure, formatting/type failure, infrastructure failure, flaky test, base-branch conflict, and credential failure; only then is a fresh repair worker dispatched with just the failure, affected artifacts, and relevant work order — not every CI log.
- **Review-comment triage policy** `preserved` `recovered`
  - Each PR comment is classified (blocking correctness, valid maintainability, clarification, optional, out-of-scope, stale, false premise); DotLn answers factual questions from evidence, applies clearly valid changes, pushes back with grounded reasoning, converts scope expansion into follow-ups, and escalates only ownership/product-judgment calls. Substantive updates rerun affected gates.
- **Closeout and system improvement phase** `preserved` `north-star`
  - On completion DotLn stops servers, closes browsers, archives traces per data policy, removes worktrees, records resource use/429s/rework, and updates the RepoProfile with newly validated stable facts; a revealed gap becomes a scoped candidate feedback unit with a regression fixture — tested before promotion, never another always-loaded markdown file.
- **Model-optional actor topology** `preserved` `north-star`
  - The session topology table gives each actor an exact context diet and lifetime — and some actors (source collector, PR composer) need no model at all, being pure API mechanics or deterministic assembly. A normal story is 'a handful of bounded reasoning episodes, not fifty model calls and not one immortal 500,000-token conversation'.
- **Main thread as reactive traffic cop** `adopted` `north-star`
  - The main Claude thread is only an intent and decision interface: it emits typed actions, specialized effects listen for relevant signals and update shared state, and a reducer/mediator hands the traffic cop a compact script — GPT explicitly grounds this in Dylan's own prior notes (redux/rxjs-style agentic communication).
- **Concrete story-to-PR statechart** `preserved` `recovered`
  - A full named-state machine (requested → acquiringSource → framingContract ⇄ clarificationRequired → baselining → planning → implementing → selfChecking → behaviorVerifying ⇄ repair → codeReviewing → preparingPr → prOpen with ciRepair/reviewRepair/storyChanged → readyForMerge → closed) plus parallel interruption states (rateLimited, environmentBlocked, permissionBlocked, operatorPaused, cancelled) with continuation-recorded resume points; the function table, statechart, RPG build, and event timeline are projections of the same program.
- **PR-ready evidence checklist** `adopted` `north-star`
  - 'Done' is a 16-item conjunction (current source revision, explicit contract, no unresolved material ambiguity, reproduced baseline, repo-native implementation, no unexplained scope, tests/build/lint, live route walked, visual claims visually inspected, every AC evidenced, independent verification and review, final diff inspected, grounded PR text, monitored loop). A passing unit test alone is not done; Claude saying 'implemented successfully' is not evidence at all.
- **Eight-component realistic v0.1** `transformed` `recovered`
  - The first usable product needs only: Repository Registry, Ticket Source Adapter (enterprise-tracker-style), Story Contract Compiler, Workstream State Machine, Worker Runtime Adapter (whatever the target machine proves viable), Git/Worktree Adapter, Playwright Verification Adapter, PR Adapter — deferring the RPG universe, factor graphs, town simulation, and business Codex. Notably diverges from the north star's pattern-first milestone path (Repo Gardener + Seiri before real work).
  - *Generalized:* A minimal adapter set for any source-artifact → verified-deliverable loop; the metaphor/simulation layers are projections added after the work loop functions.

  *Coined terms:* **DotLn** — Dylan's shortened name for 'Days of the Natural Logarithm' (with 'Dylan' hidden in the letters), coined in this chat as the project name replacing the earlier working title.; **SourceBundle** — Immutable, provenance-carrying snapshot of a source ticket artifact: metadata, formatted sections with rich-text semantics, discussions, attachments with image evidence, and revision history, pinned to a captured revision number.; **StoryContract** — Typed contract compiled from an imperfect story: purpose, current/desired behavior, acceptance criteria, examples, constraints, non-goals, assumptions, open questions, and the source revision it was derived from.; **RepoProfile** — Read-only typed registration of a repository: commands (install/build/test/lint/format), local-app startup, branching/PR policy, environment authority, instruction sources, and known architecture.; **Story Interpreter** — Fresh task-scoped episode that turns the SourceBundle into the StoryContract, inferring the artifact's own formatting conventions rather than applying global rules.; **Repo Cartographer** — Read-only worker that maps the change surface into a structured ImpactMap (entry points, state ownership, shared consumers, existing tests, similar implementations) rather than a prose repo summary.; **Live Witness** — Episode that runs the current base branch to reproduce a defect (or walk surrounding behavior for a story) and preserves baseline evidence before any change is made.; **Behavior Verifier** — Independent fresh episode that proves acceptance criteria against the running app; deliberately blinded from the implementer's narrative to reduce confirmation bias.; **Staff PR Reviewer** — Separate independent episode answering 'is this the right implementation to maintain and ship?' — distinct from the Behavior Verifier's 'does it work?'.; **WorkOrder** — Typed bounded task input for a worker episode: objective, ACs, relevant facts, decisions, constraints, non-goals, suggested files, allowed/prohibited operations, required checks, output contract.; **Decision packet** — Structured operator interruption: the conflict, current repository behavior, enumerated options, a recommendation with reasoning, and the impact of waiting.; **Source Revision Guard** — Affix-level guard that watches the source artifact's revision and forces re-evaluation, invalidating affected plan/evidence when a material change lands mid-cycle.; **Repo-native (Angular)** — The current codebase's deliberate architecture as the authority for conventions — explicitly not 'latest best practice' imposed over an established repository.; **VerificationFinding** — Typed verification-failure record: criterion, severity (blocking/major/minor), observed vs expected, reproduction steps, evidence references, likely code surface.; **Acceptance evidence matrix** — Living table mapping each AC to exact behavior, source evidence, code surface, automated test, live evidence, and status; the operational spec that evolves through the workstream, completed by the verifier.; **PR-ready** — A 16-condition evidence checklist that must all be true before DotLn may claim success; a passing test, a screenshot, or Claude's say-so individually count for nothing.

## Chat 006

*Operator ask:* Dylan delivered three things: (1) the project name "Days of the Natural Logarithm" with three reasons (sounds cool, sounds procedurally generated, hides "Dylan" in DAYs-of-the-LN); (2) an explicit anti-recency-bias directive — he liked many intermediary ideas and does not want later ideas to overwrite them except where they add or clarify; (3) an excited final piece for the RPG analogy: Path of Exile 1 links, with extrapolation explicitly delegated to GPT ("I'LL LET YOU EXTRAPOLATE FROM THERE").

- **Days of the Natural Logarithm (project name)** `adopted` `recovered`
  - Dylan's name for the whole system: sounds cool, sounds like a randomly generated title, and steganographically hides his name (DAYs of the LN = Dylan). This is the direct ancestor of the current 'DotLn' name.
- **Anti-recency-bias / append-only design history** `adopted` `recovered`
  - Dylan's explicit meta-rule for the ideation process itself: intermediary ideas must be preserved rather than compressed into whichever idea came last; new ideas only add or clarify. GPT restated it as 'no last-message-wins architecture' with design history as an append-only concept lineage.
- **PoE 1 links as the composition grammar** `adopted` `recovered`
  - Dylan's seed idea: Path of Exile 1 socket links complete the RPG analogy. Links supply scope, compatibility, bounded composition, resource cost, shared modifiers, trigger semantics, build planning, and a visual answer to 'which rule applies to which action?' — the UI and composition system the earlier architecture was missing, not a replacement for it.
- **Concept-lineage relationship taxonomy** `preserved` `recovered`
  - Every significant idea gets one typed relationship to the existing model: FOUNDATION, EXTENSION, FORMALIZATION, PROJECTION, SPECIALIZATION, SUPERSESSION (must state why), or EXPERIMENT. Includes a proposed 'Design Lineage' appendix in the North Star recording this instead of rewriting older layers out of the story. Directly formalizes Dylan's anti-recency directive.
- **Log-odds additive composition of behavior** `preserved` `recovered`
  - Each linked support contributes an odds multiplier r_i to a behavioral tendency; O_eff = O_base * prod(r_i), and taking ln turns composition additive: base identity + role + supports + environment + learning = current disposition. Gives the project name a real technical meaning: behavior evolving over time through composable additive influences.
- **DAYLN namespace and subsystem naming hierarchy** `raw` `recovered`
  - Public name stays long; code namespace is DAYLN (@dayln/kernel etc.) with named subsystems: Launchpad (work orchestration app), Forge (loadout/pattern compiler), Codex (pattern library), Chronicle (events/episodes/lineage), Atlas (repos/workstreams/environments), Simulacrum (counterfactual simulation). Also: the model-agnostic name survives Claude/Opus. Superseded by 'DotLn' as a brand, but the subsystem decomposition is a useful map.
- **PoE-to-agent-system semantic mapping table** `preserved` `recovered`
  - A near-complete dictionary: skill gem = atomic action/capability; support gem = pure modifier of compatible behavior; socket = typed extension point; link = scope; link group = one compiled behavioral program; gem tags = compatibility interface; attribute requirement = required competence/authority/tooling; mana multiplier = token/latency/tool cost; item = host context; affix = item-scoped modifier; passive tree = stable learned policy; ascendancy = operating doctrine; map = task environment; map mods = repo/task conditions; Atlas = workstream topology; Path of Building = preflight compiler/simulator.
- **Links are scope, not sequence** `preserved` `recovered`
  - The critical law: a link means 'these modifiers participate in this behavior's semantics,' never 'execute sockets left to right.' Division of labor stays explicit: links = static composition/modifier scope, statecharts = legal control flow, continuations = future workflow structure, cadence = temporal emission, RxJS = runtime plumbing.
- **Support commutativity requirement** `preserved` `recovered`
  - Ordinary supports must commute: A(B(skill)) === B(A(skill)), so socket order carries no meaning. When two transformations genuinely do not commute, the compiler must force an explicit pipeline, statechart fragment, declared precedence, conflict resolver, or reject the link — non-commuting transforms may not masquerade as ordinary supports.
- **Tag-based compatibility type system** `preserved` `recovered`
  - Skills carry tags (observe, research, plan, mutate, communicate, verify, schedule, delegate, narrate, destructive); a SupportGem declares supportedTags, requiredCapabilities, conflictsWith, a pure transform(skill, context) -> CompiledSkill, and a ResourceVector cost. Compatibility is statically checkable, making 'which rule applies to which action' a type question.
- **Static pre-link validation (SUPPORT INACTIVE)** `preserved` `recovered`
  - If a support's required capabilities are missing (e.g. Screenshot Verification without a browser), the UI does not hope the model figures it out — it marks the support inactive, lists exactly what's missing, and offers concrete corrections (equip capability, reassign executor, remove support).
- **Socket colors as behavior families** `preserved` `recovered`
  - Optional visual typing: RED = Effect (mutation/authority/irreversible impact), GREEN = Sense and Flow (observation/browser/scheduling/routing), BLUE = Thought (analysis/planning/verification/narrative), WHITE = polymorphic Adapter — loosely preserving the Str/Dex/Int intuition. Explicitly a representation layer, not the canonical type names.
- **Link groups fix the v1 context failure (aura-stacker diagnosis)** `adopted` `north-star`
  - V1 is diagnosed as an 'aura stacker' reserving ~half a million tokens before entering the map: every rule always-on, global, context-consuming, mutually conflicting. V2 session = 1 active behavior + 2-5 relevant supports + a tiny immutable safety layer + exact task state; everything else stays in stash/codex consuming no episode context.
- **Six-link as default composition budget** `preserved` `recovered`
  - The link limit becomes visible context-budget design: six links is the default composition budget, not a hard cap; a nine-link should feel exceptional and trigger review questions (decompose the work? make supports deterministic infrastructure? move a concern to an independent verifier? is this really one atomic skill?).
- **Shared supports across multiple actives** `preserved` `recovered`
  - Multiple active skills in one link group can share the same supports (e.g. Inventory + Classify + Propose Removal all under Evidence-Bound + Read-Only + Operator-Away) — a middle ground between duplicating rules per agent and making rules global. Default remains one active per group; multi-active groups are for deliberately cohesive kits under one policy boundary.
- **Supports compile to heterogeneous mechanisms** `adopted` `north-star`
  - A support gem is not necessarily prompt text: categories compile to hard permission sets, output schemas/completion gates, event subscriptions, timers, deterministic checks or verifier episodes, deterministic transformers, scope boundaries, budget adjustments, continuation changes, communication transforms, policy-score adjustments, or fan-out generators. Only a subset consume model context.
- **Per-support cost transparency** `preserved` `recovered`
  - Every support's tooltip declares its implementation mechanism and true cost: prompt cost in tokens (often 0 for deterministic guards), runtime cost, and whether it spawns additional actor invocations (e.g. a verifier episode returning only a result envelope). Makes context economics inspectable per modifier.
- **PoE support mechanics as interaction-pattern vocabulary** `preserved` `recovered`
  - Existing PoE supports name a nearly complete catalog of agent interaction patterns: multiple projectiles = fan-out candidates; fork = competing branches; chain = pass result through targets; concentrated effect / increased area = trade scope for rigor; spell echo = bounded repeat; unleash = accumulate permits then burst; cast-while-channeling = sidecar; cast-when-damage-taken = failure-triggered reactor; cast-on-death = postmortem/recovery; empower/enhance/enlighten = model tier, quality bar, overhead reduction; lifetap = shift cost between budgets; guard = circuit breaker; curse/mark = target-specific adversarial modifier; totem/minion = delegate to another actor.
- **Operator-pressure rule as a trigger build** `preserved` `north-star`
  - The existing feedback_under_pressure_dispatch_first rule reprojects as 'Cast When Operator Damage Taken': trigger on regression-language event, skill = dispatch evidence-gathering worker, supports = no-main-thread-read, terse-output, silent-wait, result-envelope-only. The PoE representation makes the codified mechanism instantly inspectable.
- **Every failure drops a gem** `adopted` `north-star`
  - The v1-to-v2 migration loop as loot: regression occurs -> preserve incident -> extract observable failure -> define desired behavior -> select scope and compatible tags -> choose implementation mechanism -> create regression fixture -> forge support gem -> equip only where relevant. Incidents literally mint scoped, typed policy artifacts.
- **Gem maturity model (experience, quality, Awakened)** `preserved` `recovered`
  - Each policy gem carries empirical maturity stats: level, quality, observed eligible episodes, activations, incidents prevented, false activations, operator overrides, current implementation mechanism, and an explicit next-maturity condition (e.g. generalize across two more repositories). 'Awakened' means generalized, cross-repository, empirically tested, low false-positive, deterministically enforced — not merely stronger.
- **Corrupted gem = immutable version for replay** `preserved` `north-star`
  - A corrupted gem is an immutable historical version of a policy retained for exact replay: it cannot be edited in place and must be forked into a new version. Specializes the north-star's versioned-identity/no-silent-drift rule down to individual feedback mechanisms.
- **Vaal skill = evidence-gated authority escalation** `preserved` `recovered`
  - A high-impact variant of a skill (Vaal Seiri may actually delete, not just propose) unlocked only by accumulated evidence, isolated worktree, prior verification, sufficient accumulated confidence, and explicit approval or policy authority. Authority escalates through earned evidence and approval — never through elapsed operator absence — which harmonizes with the north-star anti-goal.
- **Complete scope hierarchy (beyond armor)** `preserved` `recovered`
  - Each organizational concept gets a natural scope level instead of being forced into 'armor': character/identity, passive tree (stable learned defaults), ascendancy (operating doctrine: planner/implementer/watcher/falsifier/coordinator), equipment, item affixes, sockets and links, auras, map modifiers, buffs/debuffs, flasks (temporary operator intervention), events. The pattern library remaps accordingly: 5S = equipment set, leadership ladders = passive branches, commedia roles = ascendancies, Theory of Constraints = party aura/global scheduler, SMART = quest-quality gate, explore/exploit = stance with tension ratio, lazzi = triggered side skills with strict budgets, Operator Away = map state, Playwright = equipped tool.
- **Auras = team policies with visible reservation cost** `preserved` `recovered`
  - Always-on team-wide policies are modeled as auras that reserve capacity: global policy is allowed but its permanent cost is explicit and visible, in contrast to v1 where every rule was an invisible always-on aura. Computational Kindness and Theory of Constraints are candidate auras.
- **Path of Building for organizations** `preserved` `recovered`
  - The build screen is an inspector, not just a paper doll: for any agent it shows active capabilities, exactly which supports affect each, why each is active, where every modifier came from, which modifier won a conflict, context reservation, token/tool/time costs, mutation authority, verification depth, fan-out width, recovery strength, expected latency, and observed outcome history. Clicking one behavior shows the full derivation from base + identity + role + item + supports + environment to effective result — exact mechanics and measured statistics, no fake '+42 Quality' stats.
- **Link-group IR as center of isomorphic views** `adopted` `north-star`
  - The canonical IR encodes {active, supports[]}; the same normalized program projects as RPG six-link, business 5S procedure, statechart, function table, RxJS stream, code (linkGroup(active, ...supports)), event trace, and narrative. Only complete views are bidirectionally isomorphic; simplified narrative/animation projections are lossy and the UI must say so.
- **Statechart authoritative, RxJS generated** `preserved` `north-star`
  - For temporal behavior (e.g. the Seiri operator-absent 20-minute pulse with return-interrupt), the statechart remains the authoritative lifecycle description; the RxJS stream is a generated or inspectable temporal implementation, never the source of truth.
- **Revised drag-and-drop prototype slice** `preserved` `north-star`
  - The Repo Gardener vertical slice upgraded: drag Seiri plus five supports into an empty six-link armor piece, see compatibility/requirements/costs/conflicts before linking, compile to IR, show tooltip plus equivalent statechart/function-table/RxJS/config views, emit operator.absent, advance virtual time, watch a work order flow to a fake then real disposable worker, emit operator.returned, verify cadence/continuation cancellation, and save the entire build and event history under a semantic hash.
- **'It gives the agent a build' framing** `adopted` `north-star`
  - The core product sentence: Launchpad does not give an agent a giant personality prompt — it gives the agent a build. Aggressive version: v1 loaded the entire stash into every map; v2 equips only the linked skills and supports needed for the encounter.

  *Coined terms:* **Days of the Natural Logarithm / DAYLN** — The project's public name (Dylan's coinage; hides DAYs-of-the-LN = Dylan) and its code namespace; technically reinterpreted as behavior evolving over time (days) through additive log-odds composition of influences (ln). Ancestor of the current DotLn name.; **link / link group** — A link declares scope — this support participates in the semantics of this active behavior (never execution order); a link group is one compiled behavioral program: active skill(s) plus their linked supports.; **skill gem (active) / support gem** — Active = an atomic action, agent capability, or work-order generator; support = a pure, typed modifier of compatible behavior declaring supportedTags, required capabilities, conflicts, a pure transform, and a resource cost.; **composition budget** — The six-link default limit on concerns per behavior — not a hard cap but a visible budget; a nine-link is a suspicious smell prompting decomposition or moving concerns to deterministic infrastructure or independent verifiers.; **aura** — An always-on team-wide policy with explicit reserved capacity cost; 'aura stacker' is the diagnosis of v1, which reserved ~half a million tokens of always-on global rules before entering any task.; **Awakened support** — A support that has matured: generalized, cross-repository, empirically tested, low false-positive rate, backed by deterministic enforcement — not merely 'stronger.'; **corrupted gem** — An immutable historical version of a policy retained for exact replay; cannot be edited in place, must be forked into a new version.; **Vaal skill** — A charged, bounded, high-authority variant of a skill (e.g. Vaal Seiri may delete, not just propose) unlocked only by accumulated evidence, isolation, verification, confidence, and explicit approval.; **gem experience / gem quality** — Experience = number and quality of evaluated episodes a policy has seen; quality = its reliability, clarity, calibration, or evidence strength — measured, not invented, stats.; **concept lineage** — Append-only design history where every idea declares its typed relationship to the existing model: FOUNDATION, EXTENSION, FORMALIZATION, PROJECTION, SPECIALIZATION, SUPERSESSION, or EXPERIMENT; recorded in a 'Design Lineage' appendix rather than rewriting older layers.; **links are scope, not sequence** — The critical law that socket composition defines which modifiers apply, never left-to-right execution order; ordinary supports must commute, and non-commuting transforms must become explicit pipelines, statechart fragments, declared precedence, or invalid links.; **socket color** — Optional visual typing of behavior families: RED = Effect (mutation/authority), GREEN = Sense and Flow (observe/route/schedule), BLUE = Thought (analyze/plan/verify), WHITE = polymorphic Adapter — echoing Str/Dex/Int.; **Path of Building for organizations** — The build-inspector UI concept: a preflight compiler/simulator showing every effective capability, the exact provenance and cost of every modifier, conflict winners, and observed outcome history for an agent build.; **map / map modifiers / Atlas** — Map = one task environment; map modifiers = repository, task, policy, and environmental conditions; Atlas = the workspace and workstream topology.

## Chat 005

*Operator ask:* Dylan's messages are a running notebook rather than a single question: he diagnoses v1 ("github repo of my entire personality" now opening sessions with ~500k tokens), states his direction (atomic deterministic lego agents, declared intent, reactive agents mirroring his own corrections, off-main-thread rule pipelines), and dumps a dense batch of generative-agents/town-simulation research questions plus stochastic-optimization and quality-book notes. It ends with an explicit live directive: combine all previous context and prompts into one coherent vision, then begin what it takes to start the project.

- **Personality-as-versioned-repo** `adopted` `north-star`
  - v1 is a version-controlled autobiography of corrections: every time Dylan berates Claude, a new feedback rule is authored and committed, and future sessions inherit the accumulated body. This is the founding artifact v2 must compile rather than discard.
- **Context-bloat crisis** `adopted` `north-star`
  - The rule corpus collapsed under its own success: fresh sessions open with ~500k tokens preloaded, rules fire in wrong situations, and important instructions vanish when most needed. This is the forcing function for the entire v2 architecture.
- **Atomic lego agents** `adopted` `north-star`
  - A bunch of atomic agents that each do one thing well, deterministic, combined like legos. Dylan's most direct architectural statement; becomes 'facets' in the north star.
- **Declare-intent blackbox** `adopted` `north-star`
  - The operator declares intent at a high level and treats the executing machinery as a near-blackbox, inspecting only when desired.
- **Mirror feedback agents** `adopted` `north-star`
  - Reactive agent(s) that mirror Dylan's own interactions with Claude — automating the interventions he makes when reviewing output, so his reactions run as machinery instead of him supervising.
- **Off-thread rule pipeline** `adopted` `north-star`
  - Pull roughly half of the 100+ feedback rules out of context and run each prompt through a pipeline that is not attached to the main thread, with results aggregated back rather than every rule living in the parent conversation.
- **File-based shared-state bootstrap** `preserved` `recovered`
  - As a pragmatic first implementation, the detached pipeline agents 'might just all interact through some shared state in like saved files or something, like claude internally uses in its workflow fan outs.' The north star specifies an event store but never records this cheap file-based bootstrap path.
- **Traffic-cop decongestion** `adopted` `north-star`
  - Quality checks are defined as very specific single-minded checker agents precisely so they 'dont clog the main traffic cop' — the main orchestrating thread stays lean and routes work rather than holding rules.
- **Prove-it evidence discipline** `adopted` `north-star`
  - Guardrails everywhere in unfamiliar repos: make unit tests, open Playwright MCP and walk the actual app, use MSW mocks — 'prove to me what you're saying you accomplished is working.' Claims require live-behavior evidence, not assertions.
- **Exemplar-driven generation** `preserved` `north-star`
  - On greenfield work Dylan hand-crafts examples for the model to pull from later, and can state best practices/architecture/style and have it churn out code matching what he would create with high fidelity. Quality is steered by curated exemplars, not just rules.
- **Game-AI sandbox dream** `adopted` `north-star`
  - The Full Sail origin: sit one level above the AI-for-games techniques, mix and match behavior implementations in a sandbox, and judge by end results without caring about implementation. This is the motivational root of the pattern workshop and agent-ecology horizons.
- **Index-card architecture exercise** `preserved` `north-star`
  - He wrote architecture ideas from GPT/Gemini/Copilot onto hundreds of handwritten index cards and physically added/subtracted them to test how a system would scale — a real, proven analog frontend to system design that the north star canonizes as 'physical cards as another frontend.'
- **Six-month livability test** `preserved` `recovered`
  - The specific evaluation question in the card exercise: 'see how i'd like using this system in 6 months' — judging a design by projected lived experience with it, not just correctness. This acceptance heuristic never made it into the north star's success criteria.
- **Magnetic-LED whiteboard** `preserved` `recovered`
  - A wished-for physical-dynamic interface: magnetic LED screens on a whiteboard so the index-card mixing exercise can be done dynamically. Bridges analog manipulation with live digital state.
- **Rambling-as-input** `preserved` `north-star`
  - Extreme operator verbosity is a feature: 10 paragraphs in 5 minutes of wants, warnings, references, and past failures, with the LLM mapping 'insane rambling into actual productive useful instructions and code.' Verbatim ramble is high-density intent data the system should ingest, not sanitize away.
- **Coworker meta layer** `adopted` `north-star`
  - Coworkers want 'why doesn't it just do the right thing' with minimal effort, so instead of teaching them, build the meta layer with all checks and balances baked in so they can point it in a direction and get up-to-standard output.
- **Short-half-life planning** `preserved` `recovered`
  - The explicit 2-3 month goal horizon paired with the warning that AI changes so quickly 'solutions here may become bottlenecks or antipatterns in a very short time' — design for replaceability of today's mechanisms. Not recorded as a north-star principle.
- **Books-as-quality-agents** `adopted` `north-star`
  - Prime v2 with Theory of Constraints, Antifragility, Thinking in Systems, and Zen and the Art of Motorcycle Maintenance; each 'aspect of quality' becomes an atomic single-minded checker agent — formalizing what he already does when reviewing Claude, contractor, and teammate output.
- **Bounded-inconsistency generator** `preserved` `north-star`
  - An error tolerance mixed with random sampling plus core inputs to naturally create realistic levels of inconsistency, bias, or hypocrisy in simulated agents — engineered imperfection as a realism mechanism.
- **Time-dilation reflection experiment** `preserved` `recovered`
  - Mess with the amount of simulated time: if an agent experiences and produces in one day what would normally take 30, how does that alter its reflection on its day — and, at a meta level, its perception of the environment it was placed in? A specific experiment the north star's Horizon 3 list omits.
- **Recognition beyond identifiers** `preserved` `recovered`
  - How do agents recognize each other with nothing from agent id, session id, process id, semantic names, or display names — do they match on public details or self-derive qualities to collect, assess, associate, and recall, and do any of those four operations have temporal aspects affecting recall? The north star contains only the bare word 'recognition'; this mechanism-level breakdown is absent.
- **Twin-town counterfactual program** `adopted` `north-star`
  - Run millions of counterfactuals of two towns, organize them by similarity, find the first instance of deviation, extend runs ten more years, and swap one resident from a high-percentage clone town into the other — tracking both the host town's reflections about the swapped agent and the agent's own.
- **All-clone town** `preserved` `recovered`
  - A variant beyond single-agent swaps: same start, but every resident of the town is a clone drawn from some similar universe. The north star records only the one-agent swap.
- **Reflection-question design space** `adopted` `north-star`
  - What decides which facts, event series, or causes get posed to an agent during reflection; whether leading questions are allowed; how close to actual events and how relevant at what time scales; which questions produce which agent behaviors; whether ideal priming questions exist. Reflection questions are interventions, not neutral observations — and question-set design is like building a 20-questions set.
- **Length-scale attention aggregation** `preserved` `north-star`
  - Agents have biases toward attention at specific temporal length scales; the open question is whether those scales can be aggregated into a coherent continuous evolution of behavior.
- **Accuracy-vs-rationale decoupling** `preserved` `recovered`
  - What if agents that predict the future at 85-95% accuracy carry rationales and reflections that are completely illogical, incoherent, or vacant — is a one-to-one mapping of decisions to outcomes required, or is that 'a rose is a rose'? An evaluation-philosophy question (score predictive accuracy separately from narrative coherence) absent from the north star.
- **Model-bootstrap question** `adopted` `north-star`
  - Should v2 be built using the current framework tuned on Opus 4.7/4.8, or from scratch with Opus 5? The north star answers it structurally: clean sibling repo, v1 demoted to corpus/benchmark, no rule inheritance.
- **Graded counterfactual builds** `adopted` `north-star`
  - 'Can you build the structure that creates the new repo and run tons of counterfactuals and have those get graded' — apply the town-sim counterfactual method to the construction of the launchpad itself, with builds evaluated against explicit criteria.
- **Terminal-only interface question** `preserved` `recovered`
  - 'Can my only interface to work be via the terminal? what integrations would be needed with claude and what would the ux be' — an explicit UX exploration of the terminal as the sole operator surface. The north star has a console app and dashboard but never addresses this question.
- **Biographical seeding** `preserved` `recovered`
  - Grounding agent identity through life-story interview questions (where did you grow up, hardest problems, hardest decisions) because such questions 'get at the fundamental core and nature of who they are.' The north star's Identity is versioned dispositions; interview-based seeding is absent.
- **Recursive-counterfactual limits** `preserved` `north-star`
  - What are the actual limits on the counterfactuals each moment could recursively generate — the curse of dimensionality applied to the town sim, demanding bounded search, optimal stopping, and controlled expansion instead of enumerating every future.
- **Framing primacy over black boxes** `preserved` `recovered`
  - If agents are just black boxes with names irrelevant — identity being the referential transparency of the shape or texture of a series of interactions and behaviors — then framing becomes the most important thing to get right. Echoed by the Poincaré line about likenesses hidden under apparent divergences.
- **Top-of-leverage agents (Meadows 1–6)** `preserved` `recovered`
  - 'if an agent had 1-6 that would be insanity' — an agent able to act at Donella Meadows' six highest leverage points for intervening in a system (1 transcending paradigms, 2 paradigm/mindset, 3 goals, 4 self-organization, 5 rules, 6 information flows) would be extraordinarily powerful. **Corrected 2026-08-31 on operator instruction:** the founding synthesis read this reaction as ZAMM's six-part lab notebook because the surrounding raw lines are ZAMM reading reactions; the actual referent is Meadows' twelve leverage points. The Meadows thread is already present in the corpus — see the `image_(9).png` entry, which classifies DotLn mechanisms by Meadows leverage level. Correction record: §WO-003 verification-window corrections.
- **Gumption-trap-reduction agents** `preserved` `north-star`
  - Agents created with the specific task of reducing gumption traps — removing the motivation-draining friction (ZAMM's term) from the operator's environment as a first-class agent role.
- **Bottleneck-paced release** `adopted` `north-star`
  - Goldratt applied to agent orchestration: release work at the velocity of the bottleneck ('Herbie at the start of the line'), and 'a system of local optimums is not an optimum system at all' — max agent utilization is explicitly the wrong objective.
- **Poincaré condensation principle** `preserved` `north-star`
  - A scientist does not choose facts at random but condenses much experience into a slender volume containing 'a thousand times as many possible experiences whose result is known beforehand' — the philosophical warrant for compiling the sprawling corpus into compact loadouts and for principled fact-selection policies.
- **Sequential-decision formal framing** `preserved` `recovered`
  - 'If you want to run a better [claude launchpad], you have to make better decisions' — the launchpad framed as a sequential decision problem under uncertainty, with Powell's unified field list (stochastic programming through MDPs and RL) and transition-probability matrices as its formal vocabulary. The north star carries decision-policy patterns but not this explicit MDP/stochastic-optimization framing.
- **Hypothesis flywheel** `preserved` `recovered`
  - From the Simile quote Dylan saved twice: generate a million hypotheses, watch the world, and measure what percentage came true at what time — 'the best way to learn about the world.' A prediction-forward learning loop; the north star's evaluation flywheel is retrospective (grade past episodes) and never records this predict-then-score variant.
- **Point-of-view before efficiency** `preserved` `recovered`
  - 'Once we have a point of view, we can very quickly make it efficient' — quoted twice by Dylan: commit compute to exploration and breakthroughs first, and only optimize after a perspective exists. A design-sequencing principle absent from the north star.
- **Data-as-binding-constraint** `preserved` `recovered`
  - Dylan's drafted interview question: of the traditional pillars (compute, algorithms, data), is data collection and acquisition the hardest element of building simulation models? Implies the launchpad's evidence corpus is its scarcest asset.
- **Reading-list anchors** `preserved` `recovered`
  - Four uncommented links: Joel Spolsky's 'controlling your environment makes you happy' (operator agency as the point of tooling), 'Two Stories' (empowered vs command-and-control orgs), Yegge's platform rant (build everything as a platform), and the Operator typeface intro (typographic care for the interface). Left without commentary, but each plausibly aims at a launchpad design value.
- **Common-law compilation metaphor** `raw` `recovered`
  - GPT's framing: v1 accumulated case law — offense, articulation, precedent, inheritance — and v2 'stops forcing the judge, legislature, police, witnesses, and entire law library into one Claude context.' A vivid explanatory metaphor Dylan never engaged with and the north star dropped.
- **Nine-stage control loop** `preserved` `recovered`
  - GPT's controlling loop — Observe, Attend, Frame, Decide, Authorize, Invoke, Verify, Learn, Continue — with each stage independently implementable, visualizable, testable, and replaceable. It operationalizes Dylan's off-thread pipeline but appears nowhere in the north star, which only has the unattended Observe/Sow/Reap cycle.
- **Rule-to-mechanism demotion** `adopted` `north-star`
  - An atomic agent does not necessarily mean an LLM invocation: most prose rules become cheaper deterministic things — repo-scoped permissions, statechart completion gates, prose lints, decision-registry guards, scheduler invariants, attempt-history guards — with Claude reserved for interpretation, synthesis, generation, and judgment.
- **Four-layer personality decomposition** `adopted` `north-star`
  - The 'github repo of my personality' becomes four layers instead of one markdown pile: source corpus (verbatim, indexed, not in live context), normalized feedback units, per-task compiled loadouts, and behavioral lineage where identity updates are proposed as versions and evaluated — never silently rewritten.
- **Autonomy envelope formula** `preserved` `north-star`
  - AutonomyEnvelope = f(CompetenceEvidence, MissionClarity, Risk, Reversibility): agents earn a current operating envelope (may inspect/propose/edit/merge, must ask/announce/verify) from evidence, never from being named 'senior.' The north star keeps a slightly leaner Competence-times-Clarity version.
- **Multi-perspective Watchers** `preserved` `north-star`
  - A Watcher is a perspective parameter applied to the shared event history, not a summarizer: architecture, product, quality, and security Watchers select different facts from the same log without any becoming canonical truth.
- **Claude-replaceability acceptance test** `adopted` `north-star`
  - A core interaction should still make sense if Claude is replaced by a person, a script, a test runner, or a physical card moving between trays — the formal criterion distilled from Dylan's index-card practice, making Claude an adapter rather than an ontological dependency.
- **Five founding lanes** `adopted` `north-star`
  - Preserve Dylan's five-way counterfactual experimentation without building five full launchpads: bounded roles — Legacy Archaeologist (inventory v1), Clean-room Architect (design from the North Star), Kernel Builder (pure reactors and fakes), RPG/Interaction Builder (one character, one item, synchronized views), Adversarial Evaluator (grades the others, cannot rewrite them).
- **Repo Gardener + Seiri vertical slice** `transformed` `north-star`
  - A 12-step bounded first slice: equip Repo Gardener with Seiri on a repository-inspection task, show the exact semantic loadout (may inventory/classify/propose, may not delete, must evidence, cadence while operator away), run first on a deterministic fake executor, then one disposable Claude session via Playwright, then a separate fresh verifier, with the continuation persisted outside both sessions.
  - *Generalized:* The slice targets 'an Angular repository' (his primary framework); generalized, it is a bounded read-only inspection task in any target repo/framework exercising UI, pure core, browser protocol, disposable sessions, external state, and independent verification in one feature.
- **Capability-audit-first bootstrap** `transformed` `north-star`
  - Do not scaffold anything until capability truth is established: create the clean sibling repo, drop in NORTH_STAR.md, and run an audit prompt from a fresh session to empirically determine which mechanisms actually exist locally (sessions, subagents, workflows, hooks, structured outputs, Playwright MCP, permissions, gateway behavior, rate-limit visibility) — then select the runtime adapter from observed evidence.
  - *Generalized:* Written for a constrained managed host behind a model gateway; generalized, probe any host environment (personal machine, any model vendor or gateway) for its real agent-runtime capabilities before committing architecture or package versions.
- **Offline-first control plane** `transformed` `north-star`
  - The dashboard and shared state must be offline-capable because Claude itself becomes useless during even brief connectivity interruptions; workstreams must survive 429s, dead sessions, and network loss.
  - *Generalized:* Motivated by intermittent network/VPN interruptions; generalized, treat the model endpoint as intermittently unavailable and keep the control plane, event store, and recovery logic fully local.

  *Coined terms:* **traffic cop** — Dylan's name for the main orchestrating Claude thread; quality rules must not clog it — checks run as detached atomic agents while the traffic cop only routes and decides.; **github repo of my entire personality** — v1: every correction of Claude committed as a feedback rule, so accumulated rules version-control who Dylan is as a reviewer/engineer.; **atomic agents** — Deterministic single-purpose agents that each do exactly one thing well and are composed like legos.; **compiler and runtime for your judgment** — GPT's v2 thesis: intent, values, feedback incidents, preferences, and context are compiled into deterministic control logic, bounded work orders, disposable sessions, and verified evidence — instead of being remembered as prose.; **executable craftsmanship** — GPT's product phrase: a local-first, model-agnostic operating system that turns craft standards into running machinery.; **intent-and-decision airlock** — What the main Claude thread should shrink to: intent goes in, decisions come out, and nothing else accumulates there.; **feedback unit** — One normalized correction incident: what happened, the wrong observable behavior, the desired one, activating trigger, scope, enforcement strength, enforcing mechanism, compliance evidence, conflicts/supersessions, and retirement condition.; **episode loadout** — The compiled bundle for one task: identity + role + repository policy + task contract + selected quality facets + operator state + risk/resource state, producing the work order, allowed tools, cadence, gates, and continuation.; **behavioral lineage** — Versioned identity evolution: Identity v7 → episodes → measured behavior → candidate v8 → replay/sandbox evaluation → adoption or rejection; nothing silently rewrites the current identity.; **capability truth** — The empirically established set of Claude/runtime mechanisms actually available on a given machine and gateway, determined by audit before any architecture is chosen.; **founding lanes** — Five bounded parallel build roles (Legacy Archaeologist, Clean-room Architect, Kernel Builder, RPG/Interaction Builder, Adversarial Evaluator) that replace building five complete competing launchpads.; **first divergence** — The earliest point where two closely paired counterfactual simulations deviate — Dylan's 'find the first instance of deviation' — used to localize causal differences.; **clone town** — Dylan's term of art: a counterfactual town that maps to another at some high percentage of similarity, used for agent-swap and whole-population-swap experiments.; **gumption traps** — Borrowed from Zen and the Art of Motorcycle Maintenance: motivation-draining friction; Dylan proposes agents whose specific task is reducing them.; **Herbie** — Goldratt's bottleneck (from The Goal), placed at the start of the line: work release is paced to the bottleneck's velocity rather than to available capacity.; **data flywheel** — Dylan's shorthand for the loop where captured episodes and outcomes continuously improve controller-level decisions about topologies, patterns, and verification.

## Chat 004

*Operator ask:* Dylan quoted a Seiri/Sort permission-and-cadence rule block applied to a "Repo Gardener" agent and had the flash that such constraint bundles read exactly like RPG armor — "how fucking sick of a UI would that be?" He asked to keep all the original business/leadership/Japanese terms but present them in an RPG manner, and reiterated that he wants state, behaviors, and events representable in an increasing number of different but isomorphically equivalent ways. He credits the inspiration to a Discord 20-year reunion with fellow Full Sail game design & development graduates.

- **Repo Gardener Seiri contract** `adopted` `north-star`
  - Dylan's quoted rule block: the Repo Gardener may inventory, classify stale/duplicate artifacts, run reference analysis, and produce deletion candidates; may NOT delete directly; must attach evidence to every candidate; activates only while the operator is absent, stops on return, re-evaluates every 20 minutes.
- **Constraint bundles as RPG armor** `adopted` `north-star`
  - Dylan's own insight: a pattern's grants/denials/obligations/triggers already have the exact structure of an RPG item tooltip, so armor/equipment is a natural UI for agent constraints and methods.
- **Original terms stay primary** `adopted` `north-star`
  - Keep the business/leadership/Japanese vocabulary (Seiri / Sort / 整理) as the primary label; the RPG title ('Visor of Necessary Things') is optional and secondary. Nothing is renamed out of existence — the game vocabulary is an additional access route.
- **Open-ended set of isomorphic representations** `adopted` `north-star`
  - Dylan wants state, behaviors, and events representable in an INCREASING number of different but isomorphically equivalent ways — the representation set is extensible, not a fixed list. The north star enumerates a fixed set of eight views; the explicit open-endedness is Dylan's nuance.
- **RPG item tooltip anatomy** `preserved` `recovered`
  - A concrete tooltip schema for a pattern card: GRANTS, RESTRICTIONS, OBLIGATION, PASSIVE (activation condition, e.g. 'Quiet Workshop — activates while the Operator is absent'), PULSE (cadence), INTERRUPT (cancellation event), with set/slot/bearer in the header.
- **Tooltip view flipper** `preserved` `north-star`
  - One item's tooltip can flip among RPG, business definition, formal mechanics, statechart, code, and observed performance — the same object rendered in each vocabulary.
- **RPG loadout = agent configuration mapping** `adopted` `north-star`
  - A near-complete table mapping RPG concepts to Launchpad semantics: character=identity, class=archetype, armor=constraints/verification, helmet=perception policy, gloves=tool access, boots=cadence/initiative, belt=memory/cache, amulet=invariants, rings=communication/data-retention policies, stance, buff/debuff, cooldown, mana=token budget, stamina=tool/wall-clock budget, party=topology, quest=task, save point=persisted continuation, loot=reusable artifacts, experience=episode outcomes.
- **Extra mappings: zone, respawn, companion** `preserved` `recovered`
  - Three mappings in this chat that the north-star table dropped: zone/dungeon = repository or worktree; respawn = fresh session resumed from external state; companion/pet = watcher or maintenance sidecar.
- **Session as summon/consumable/spell scroll** `adopted` `north-star`
  - A single-use Claude session is a summon instantiated from character identity + equipped loadout + current role + quest contract + world state + available budget; it performs one coherent action, leaves artifacts and events behind, then despawns. The durable character and quest survive; the incarnation need not.
- **Affixes as higher-order functions** `preserved` `recovered`
  - Every tooltip line is a pure modifier of type (BehaviorSpec) => BehaviorSpec; the equipped item is composed via pipe(seiri(), grant(...), deny(...), requireEvidencePerCandidate(), activateWhile(...), pulseEvery(...), interruptOn(...)). 'The affixes genuinely are function composition' — not metaphorical.
- **Affix grammar / build-crafting system** `preserved` `recovered`
  - A structured modifier taxonomy: prefixes modify WHAT a behavior does, suffixes modify WHEN/WHERE it acts, sockets provide cadence/communication/verification modules, set bonuses define pattern interactions, enchantments are task-local overrides, curses are explicit costs/restrictions, consumables are one-shot continuations. Resonates directly with the PoE links composition metaphor.
- **Modifier commutativity checking** `preserved` `recovered`
  - Some behavior modifiers commute and some do not ('pulse every 20 min while absent' vs 'while absent, start a repeating 20-min pulse' have different boundary semantics); the compiler can detect and surface when application order matters, with the normalized IR resolving the ambiguity.
- **5S as a slotted equipment set** `preserved` `recovered`
  - Concrete slot assignments: Seiri=Visor (detects the unnecessary), Seiton=Utility Belt (assigns home and retrieval path), Seiso=Gauntlets (cleans while inspecting for defects), Seiketsu=Cuirass (converts repeated success into standards), Shitsuke=Greaves (maintains cadence/discipline), plus the sixth S Safety=Shield (constrains all set abilities to approved scopes and verification gates). The north star has the 5S/6S library but not the equipment-set design.
- **Set bonuses compile to real mechanics** `preserved` `recovered`
  - Wearing more set pieces activates real compiled behaviors: 2/5 every Sort candidate proposes a canonical home; 3/5 every cleanup invokes an integrity check; 4/5 recurring repairs may generate a test/rule/script/hook/skill; 5/5 the cycle schedules its own bounded reevaluation; 6S destructive changes require isolation+evidence+verification+approval threshold. Set effects visibly arm and go dark with the real state machine.
- **Runtime states as honest status effects** `preserved` `recovered`
  - Real runtime conditions render as RPG status effects backed by actual data — e.g. a 429 gives the character a rate-limit debuff displaying the actual backoff timer; operator return makes unattended effects visibly go dark.
- **Leadership as talent trees** `preserved` `recovered`
  - Leading Self / Leading Others / Leading the Business become persistent talent branches (dispositional, slow-changing) as opposed to equipment (temporary, swappable) — a typed distinction between durable identity traits and applied patterns.
- **SMART as quest-contract quality tiers** `preserved` `recovered`
  - A task ladder: Unformed Rumor → Exploration Contract → Defined Quest → SMART-Validated Quest → Execution-Ready Quest → Verified Completion. A vague objective is not rejected — it is marked an exploration quest until enough facts exist to define measurable completion gates. SMART is entirely absent from the north star.
- **Algorithms to Live By as tactical skills** `preserved` `north-star`
  - Optimal Stopping, Explore/Exploit, Caching, Scheduling, Embrace Randomness, Avoid Overfitting, and Computational Kindness as invocable tactical skills with one-line operational semantics each.
- **Mitigated speech as dialogue stance wheel** `preserved` `north-star`
  - The six mitigated-speech levels (Command, Crew Obligation, Crew Suggestion, Query, Preference, Hint) form a selectable stance wheel; the chosen stance changes message FORM only, never actual authority — an agent can issue a direct safety warning while still lacking write permission.
- **Commedia roles as relational party composition** `preserved` `north-star`
  - Whiteface (planner/rule keeper), Auguste (maker/improviser), Contra-Auguste (falsifier/perturbation tester), Watcher (read-only chronicler) — with the added insight that these are RELATIONAL roles: a Whiteface only means something in relation to the Auguste and Contra-Auguste.
- **Lazzi as bounded side quests** `preserved` `north-star`
  - A lazzo is a small interruptible maintenance mission (repair one broken command, investigate one flaky test, clean one obsolete instruction, generate one missing tool, bridge one workflow gap) with strict scope, timer, cancellation condition, and output contract so it cannot consume the main quest.
- **Launchpad IR as universal compile target** `adopted` `north-star`
  - All editors — RPG loadout, business pattern cards, statechart, function table, code DSL, temporal/marble editor — compile into one canonical IR from which every view renders; the IR contains the actual semantics.
- **PatternInstance typed IR shape** `preserved` `recovered`
  - A concrete IR interface for a pattern applied to an actor: patternId, actorId, grants, denies, obligations, activation predicate, optional cadence, interrupts, policyEffects, continuationEffects — all readonly. The north star has FeedbackUnit and Reactor types but not this pattern-application object.
- **Physical-card importer** `preserved` `recovered`
  - Physical (index/pattern) cards listed as a first-class input path into the IR alongside the digital editors — a bridge from tangible artifacts to executable semantics, echoing the 'index cards and timers' axiom but absent as an importer from the north star.
- **One identity across all renderings** `preserved` `north-star`
  - A single canonical event (operator.returned), state (repoGardener.mode = unattended.inspecting), or behavior renders as RPG flavor text, business language, statechart transition, function-table row, RxJS marble, raw JSON, DOM data attribute, or narrative — all retaining the same identity.
- **Formal isomorphism laws** `preserved` `recovered`
  - Precision on 'isomorphic': editable representations must satisfy decode(encode(x)) = normalize(x); equivalence is proven by semanticHash(normalize(compile(view))) equality across views; operational equivalence is testable as same normalized program + initial state + event + random seed producing same next state + commands + continuation.
- **Narrative as labeled projection** `preserved` `north-star`
  - The narrative view is a projection, not a true isomorphism, because it may hide timer/authority/constraint details — acceptable only if the UI labels it as a projection and keeps 'Inspect Mechanics' one click away.
- **Semantic zoom UI** `preserved` `recovered`
  - Instead of disconnected screens, one continuous drill-down that never loses selection: Level 1 Character → 2 Item → 3 Tactics (statechart/guards) → 4 Function Table → 5 Code → 6 Proof and History (raw events, semantic hash, tests, lineage). Selecting an item cross-highlights its statechart region, table entries, cadence, events, and compiled Claude instructions.
- **Live bidirectional editing across views** `preserved` `recovered`
  - Changing the 20-minute pulse in the rhythm editor immediately updates the item tooltip; unequipping an item removes the corresponding transitions and permissions from the running program — edits in any view propagate through the IR.
- **Transmog: swappable visual skins** `preserved` `recovered`
  - A Transmog control switches visual theme without changing mechanics: Fantasy RPG, red-panda workshop, transforming robots, commedia stage, Japanese workshop, enterprise architecture, plain developer mode — 'literal semantic transmog'.
- **Three-way stat taxonomy** `preserved` `recovered`
  - The UI must never blur three kinds of 'stats': declared mechanics (deterministic contract facts like 'cannot delete files'), computed current attributes (derived from loadout + present context, e.g. current autonomy: medium), and empirical performance (measured outcomes like candidate acceptance 68%, operator rework 3.4 min).
- **No fake numbers rule** `preserved` `north-star`
  - Never invent numbers like '+37% Repository Cleanliness'; percentages appear only when the system has a defined calculation or observed data — until then use exact effects, ordinal bands, and visible tradeoffs.
- **Rarity = provenance, not power** `preserved` `recovered`
  - Item 'rarity' should encode complexity, scope, or provenance of a pattern — never imply a pattern is universally better.
- **Narrow first RPG UI spike** `adopted` `north-star`
  - One character (Repo Gardener), one equipment family (5S), one environmental state (Operator Present/Away), one rhythm (20-minute virtual pulse), one session type (disposable inspection worker), four synchronized views (RPG loadout, statechart, function table, event timeline), an 11-step scripted demo (drag Seiri on, preview semantic diff, confirm, toggle presence, advance virtual clock, watch work order emit, confirm all views agree), then swap the simulated executor for one fresh Claude session.
- **Spike sequenced after machine capability audit** `transformed` `north-star`
  - The first visual prototype comes only after the host Claude capability audit — build order is grounded in what the actual machine and gateway can do.
  - *Generalized:* Empirically audit the capabilities of whatever machine/gateway/CLI will actually run the system before committing to the first UI or runtime spike; public product assumptions are not the source of truth.
- **RPG as typed programming language, not gamification** `adopted` `north-star`
  - The crucial design statement: the RPG view is a typed, compositional programming language whose objects happen to look like characters, equipment, abilities, quests, status effects, parties, and encounters — the cute interface and the real architecture are provably the same machine.
- **Codex of original terms** `preserved` `recovered`
  - The business and leadership terminology forms the Codex — an in-system reference library of the original terms — while the RPG system makes those terms manipulable and the canonical IR keeps them exact.

  *Coined terms:* **Visor of Necessary Things** — Optional secondary RPG title for the Seiri/Sort item; the original term Seiri / Sort / 整理 stays primary.; **Launchpad IR** — The canonical normalized intermediate representation containing the actual semantics; every editor (RPG, cards, statechart, table, code, temporal) compiles into it and every view renders from it.; **PatternInstance** — Typed IR object for a pattern applied to an actor: grants, denies, obligations, activation predicate, cadence, interrupts, policyEffects, continuationEffects.; **BehaviorModifier** — A pure function (behavior: BehaviorSpec) => BehaviorSpec; every tooltip line/affix is one, and an equipped item is their pipe-composition over a base behavior primitive.; **Quiet Workshop** — Passive-ability name for 'activates while the Operator is absent' on the Seiri item.; **Evidence-Bound** — Prefix affix: every recommendation requires supporting evidence.; **of Quiet Hours** — Suffix affix: active only while the operator is absent (suffixes modify when/where a behavior acts).; **Twenty-Minute Pulse** — Socketed rhythm affix: the item re-evaluates every 20 minutes.; **Return Interrupt** — Enchantment affix: immediately cancels on operator return.; **Propose-Only** — Restriction affix: no destructive authority — the agent may generate candidates but never delete directly.; **Transmog / semantic transmog** — Switching the UI's visual skin (fantasy RPG, red-panda workshop, robots, commedia, Japanese workshop, enterprise, plain dev mode) without changing any mechanics.; **Semantic zoom** — A single drill-down UI from Character to Item to Tactics to Function Table to Code to Proof/History that never loses the current selection, replacing disconnected screens.; **Set bonus** — A compiled interaction among equipped patterns that activates with piece count (e.g. 3/5 Inspect While Cleaning: every cleanup action invokes an integrity check); visibly arms and darkens with the real state machine.; **Exploration Contract** — Quest-quality tier for a vague objective: not rejected, but marked exploratory until enough facts exist to define measurable (SMART-validated) completion gates.; **Codex** — The library of original business/leadership/Japanese terms inside the system; the RPG layer makes them manipulable while the IR keeps them exact.; **Semantic hash** — Hash of the normalized IR used to prove two editable representations (e.g. RPG loadout and statechart) compile to the identical program.

## Chat 003

*Operator ask:* Dylan, nearly caught up on his own reading, asks a process question: should he keep feeding GPT more context from his previous days of notes, or should they pivot to planning how to get the project off the ground in the constrained environment. He adds one substantive constraint — when they do start, they first need to see which Claude options are actually available in that environment.

- **Bounded final context dump** `preserved` `recovered`
  - Transfer all remaining raw notes as one finite, complete drop of design evidence — uncleaned, with repetitions, contradictions, and fragments intact — rather than as a prerequisite stream for endless further ideation.
- **Note-intake sorting taxonomy (design ledger)** `preserved` `recovered`
  - Raw notes get sorted into eight bins: durable product principles, candidate grammar primitives, pattern-library entries, UI metaphors, runtime/orchestration requirements, safety and data-policy requirements, interesting-but-deferred ideas, and contradictions/unresolved design choices. The output is a compact ledger showing what each dump added and what remains uncertain.
- **Interaction grammar as the product core** `preserved` `north-star`
  - The product's core is its interaction grammar, so a discarded sentence in old notes (Double Dutch, 5S, clown hierarchies, mitigated speech, sowing/reaping, operator absence) may become a real primitive — capturing source material now is cheaper than rediscovering it after encoding the wrong abstractions.
- **Ideation restraint discipline** `preserved` `recovered`
  - An explicit commitment not to answer a context dump with another enormous speculative architecture unless something materially changes — the response should be a restrained consolidation, not fresh design. A process guard against architecture churn during intake.
- **Reconnaissance, not scaffolding** `adopted` `north-star`
  - The first session in a new environment should inspect what the environment actually permits, not run generators or select packages from memory. Discovery precedes any code generation.
- **v1 project-state inventory checklist** `transformed` `north-star`
  - Before building, audit the existing v1 system: repo structure, git status and uncommitted work, existing CLAUDE.md/rules/hooks/skills/commands, whether it is already an Nx workspace, toolchain versions, and a preserve/extract/discard triage of what v1 implements.
  - *Generalized:* Inventory any pre-existing system and environment before building its successor, producing an explicit preserve/extract/discard triage instead of assuming a blank slate.
- **Claude surface capability matrix probe** `transformed` `north-star`
  - Query the installed binary and local configuration directly for what actually works: interactive/noninteractive modes, custom agents and subagents, background/detached sessions, workflows, session resumption, hooks and hook event types, skills/rules/commands/plugins, MCP and Playwright MCP, structured output, tool/filesystem permissions, cross-repo access, gateway model choices, rate limits, and locally exposed telemetry.
  - *Generalized:* Empirically probe whatever agent harness and model gateway is present — features that exist publicly may be disabled, wrapped, renamed, or metered differently locally — and build the runtime around the discovered matrix.
- **Local capability matrix as source of truth** `transformed` `north-star`
  - Never design from public product documentation ('architecture by assumption'); the locally discovered capability matrix is the authoritative input to all mechanism decisions.
  - *Generalized:* Local empirical capability discovery precedes and governs every architectural commitment, for any model provider or harness.
- **Minimal browser-viability experiment** `preserved` `recovered`
  - One harmless round trip proves the browser channel: a Claude session drives Playwright to open a local test page, reads a structured task from it, changes exactly one legal state through the DOM, submits a typed result, and a second fresh session reads that result back. A concrete two-session handoff proof, not just 'test Playwright'.
- **Multi-assumption falsification bundle** `preserved` `recovered`
  - Design one small experiment to prove or disprove many assumptions simultaneously: Claude-to-browser ergonomics, DOM interaction cost, how much Playwright output enters context, whether isolated browser contexts are needed, whether browser storage survives fresh sessions, whether single-use sessions work under the gateway, and whether the main thread can stay nearly empty.
- **Application as full orientation source** `preserved` `north-star`
  - A fresh session should be able to receive its entire orientation from the application itself (via the browser/DOM), rather than from accumulated prompt context — the app is the briefing, the session arrives empty.
- **First vertical slice pipeline** `adopted` `north-star`
  - Create task in browser → compile a deterministic work order → launch a fresh task-scoped Claude worker → worker claims the task through Playwright → performs one bounded repository action → submits a structured result → terminates → a statechart selects the continuation → a fresh verifier session checks the result.
- **Audit-adaptive mechanism substitution** `preserved` `north-star`
  - Keep the slice's semantics fixed but let the capability audit swap its mechanisms: use background sessions if they are excellent, route through subagents if that is the only way past a main-thread cap, and so on. Mechanism choice is an output of discovery, not a design-time decision.
- **Compact browser-action skill/CLI wrapper** `preserved` `recovered`
  - If Playwright MCP proves context-heavy, retain browser semantics but wrap common actions in a compact skill or CLI so the interaction stays cheap in tokens while the browser remains the interaction protocol.
- **Local event service with browser as shared world** `preserved` `recovered`
  - If browser storage persistence across sessions is awkward, add a tiny local event service for durable state while the browser remains 'the shared world' — the coordination substrate agents see and act through. Persistence and shared-world rendering are decoupled concerns.
- **Thin dispatcher through subagents** `preserved` `north-star`
  - If only subagents avoid a main-thread session cap, route worker dispatch through a tiny dispatcher session whose sole job is spawning task-scoped subagents, keeping the main thread nearly empty.
- **Build around existing v1 system** `transformed` `tension`
  - If the existing v1 system already solves part of the pipeline, build around it rather than replace it. This cuts against the clean-room-successor stance (v1 as source corpus and benchmark, not runtime inheritance) that the north star and DotLn itself take.
  - *Generalized:* Reuse proven prior infrastructure instead of rewriting it — but only where doing so does not smuggle old abstractions into the new architecture.
- **Repo tree and Claude config as grounding artifacts** `transformed` `recovered`
  - After the conceptual notes, the two most useful artifacts to ingest are the current v1 repository tree and its existing Claude configuration — but raw conceptual notes come first, because concepts outrank current implementation as design input.
  - *Generalized:* Order intake as concepts first, then the current system tree and agent configuration as grounding artifacts.
- **Context consolidation plus ignition plan** `transformed` `north-star`
  - After the final note dump, produce a restrained consolidation of everything plus a constrained-host ignition plan whose first live action is capability discovery rather than architecture by assumption.
  - *Generalized:* Close the ideation phase with a consolidation document plus an ignition plan whose first action in any target environment is capability discovery.

  *Coined terms:* **bounded final context dump** — A finite, complete transfer of all remaining raw notes, treated as design evidence to be sorted — explicitly not a prerequisite for endless further ideation.; **design ledger** — The compact output of note intake: what each dump added (principles, primitives, patterns, metaphors, requirements) and what remains uncertain — as opposed to a new speculative architecture.; **capability audit / capability matrix** — An empirical inventory, built by querying the installed binary and local configuration, of what the Claude tooling and gateway actually permit; 'the local capability matrix is the source of truth'.; **reconnaissance, not scaffolding** — The stance for the first constrained-host session: inspect what the environment permits before generating any code or choosing packages.; **architecture by assumption** — The anti-pattern of designing around publicly documented features instead of locally discovered capabilities; the first live action should be capability discovery instead.; **browser as the shared world** — The browser/application remains the shared coordination substrate agents perceive and act through, even if durable persistence moves to a tiny local event service.; **interaction grammar** — The set of interaction primitives (speech acts, patterns, cadences, roles) that constitutes the product's core; discarded note fragments may become real primitives of it.; **constrained-host ignition plan** — The concrete startup plan for the constrained environment, produced after context consolidation, beginning with capability discovery.

## Chat 002

*Operator ask:* Dylan's message file is empty, but from GPT's attributions he had dumped roughly twenty raw intuitions — continuations as the workflow spine, a Morse-code/cron rhythm notation, business-book and commedia patterns as agent configuration, an upside-down-parabola of autonomy during operator absence, Double Dutch timing, sow/reap counterweights, source-vs-summary data policy, a hard no-model-downgrade line, a designed-without-AI constraint, and a silly animated-minis UI — and was implicitly asking whether these cohere into one product. GPT's opening line "This resolves into one coherent architecture" confirms the ask was synthesis and validation, not a single narrow question.

- **Executable organizational pattern language** `adopted` `north-star`
  - Launchpad's core definition: users compose familiar ideas (5S, SMART, explore/exploit, leadership styles, clown masks, communication modes, rhythms) and the system compiles them into statecharts, pure transition functions, permissions, schedules, resource allocations, work orders, verification requirements, and continuations.
- **Model-replaceability slogan** `adopted` `north-star`
  - "The model changes. The organization survives." Claude is one nondeterministic executor of the compiled program — "not the stage, the script, or the memory of the production" — which is how the product survives churn in models, prompting fashion, and orchestration tooling.
- **Pure step function with explanation trace** `adopted` `north-star`
  - step(P,S,E,R) -> (P',S',C,T,R',X): program + snapshot + event + RNG state deterministically yield next snapshot, commands, schedules, next RNG, continuation, and an explanation trace X. Model output may vary, but why an episode was spawned, with which identity, prompt, tools, budget, and continuation is exactly reproducible.
- **Function-table runtime** `adopted` `north-star`
  - The kernel implemented as ordinary lookup tables (transitionTable, policyTable, predicateTable, effectTable, patternTable, rendererTable); the persisted representation stores IDs and data, never serialized closures. Statecharts are the authoring representation; tables are one execution representation.
- **Many bounded machines, not one giant statechart** `preserved` `recovered`
  - Explicit design rule: never one statechart containing every agent, task, timer, tab, and workstream — instead many bounded machines (one per task, agent incarnation, workstream, maintenance cycle) communicating through events, citing statecharts.dev guidance.
- **Continuation workflow grammar** `adopted` `north-star`
  - Program ::= Done | Emit | Invoke | Await | Sequence | Choose | All | Race | Guard | Repeat | Compensate. A continuation is 'a serializable description of what remains to be done after the current result arrives'; after each step, the residual Program IS the continuation.
- **Single-use session lifecycle** `adopted` `north-star`
  - A fresh session reads one continuation, executes one assigned command, emits a typed result event, terminates; the pure controller reduces the remaining program and starts another fresh session at the next Invoke node. 'The session no longer needs to remember the workflow. The workflow remembers the session.'
- **12-Days-of-Christmas restart framing** `preserved` `recovered`
  - Dylan's metaphor for context-free resumption: a replacement singer joining at day four needs only the current verse, tempo, score, and expected output contract — not the transcript of every previous performance. Motivates work-order minimalism for fresh sessions.
- **Four-layer context split** `preserved` `recovered`
  - An explicit division of context responsibility: CLAUDE.md holds only universal repo facts and hard-to-rediscover pitfalls; the work order holds current objective/facts/role/constraints/gates; the continuation holds what happens after the result; the event store holds what actually happened. Warns against CLAUDE.md becoming 'Launchpad's encyclopedia.'
- **Temporal algebra (Cadence grammar)** `adopted` `north-star`
  - Cron only answers calendar-time firing; a Cadence AST (Once, After, Every, Burst, Calendar, Window, While, Until, Gate, Sequence, Merge, Race, Repeat, Backoff) covers duration, cancellation, state-dependent timing, bursts, backoff, and races; cadences emit domain events (e.g. Burst(3, 20s) -> ResearchProbeRequested x3).
- **State-derived cadence** `adopted` `north-star`
  - Cadences are purely derived from agent state + world snapshot (cadenceFor(state, context)), never orphan cron jobs that persist because a file says they exist; operatorReturned cancels the unattended cadence, rateLimited switches to backoff-with-jitter.
- **Marbles as projection and test notation** `adopted` `north-star`
  - Marble/Morse notation is for rendering relative signal patterns, virtual-time testing (TestScheduler), and comparing intended vs observed event streams — not the canonical persisted syntax, which is the structured Cadence AST. The UI can still render a Morse-like track view.
- **Three synchronized lenses per pattern** `adopted` `north-star`
  - Every pattern has a familiar lens ('5S', 'Whiteface'), a formal lens (actors, topology, states, authorities, budgets), and a code lens (TypeScript, XState, function tables), all compiled from one definition. 'The analogy must compile into exact mechanics' is what keeps the sales insight from being a gimmick.
- **Pattern card as typed contributor** `preserved` `recovered`
  - A PatternDefinition contributes statechart fragments plus policy/cadence/permission/budget/message transforms, completion gates, metrics, failureModes, and counterPatterns, with validScopes (agent/relationship/team/workstream/environment). 'A pattern is not a prompt snippet' — the generated prompt is one downstream artifact.
- **Typed card sockets** `preserved` `recovered`
  - Each mini/team exposes explicit slots — Purpose/Method, Mask/Role, Stance, Rhythm, Voice, Memory, Authority, Budget, Safety — and cards carry scope; invalid combinations are rejected or require an explicit adapter, preventing arbitrary book-idea soup.
- **Compiled-effect preview** `preserved` `recovered`
  - Before a card is applied, the UI shows the exact compiled diff (e.g. applying Seiri to Repo Gardener: +may inventory, +may classify, -may not delete directly, +must attach evidence, +only while operator absent). 'That makes the silly UI trustworthy.'
- **Familiar-to-formal mapping table** `adopted` `north-star`
  - A concrete mapping of each shelf concept to a formal pattern and effect: leading self/others/business, personal values as invariants+weights, SMART as readiness guard, 5S as maintenance statechart, optimal stopping as search termination, mitigated speech as explicitness transformer, clown trio as planner-maker-falsifier topology, lazzi as bounded sidecars, watcher as read-only projection, computational kindness as cognitive-load objective.
- **Staged SMART gating and exploration contracts** `preserved` `recovered`
  - SMART validation belongs at workstream creation, promotion from exploration to execution, worker dispatch, and verification-plan creation — never blocking git status because a goal lacks a deadline. Pipeline: vague idea -> exploration contract -> evidence gathered -> execution-ready goal -> SMART validation -> dispatch; exploratory work is legitimately unmeasurable in advance.
- **Safety vs method-card layering** `preserved` `north-star`
  - Hooks enforce hard operational safety (no push to main, no forbidden paths, no destructive commands, no secret exposure); management-method cards shape or validate workflow and must not masquerade as security controls.
- **Polar axes with relation taxonomy** `adopted` `recovered`
  - From Dylan's 'a time to sow and a time to reap': behaviors modeled as PolarAxis pairs (research/execute, create/remove, challenge/support, continue/stop...) each tagged with a relation type — inverse, complement, counterweight, or compensation — plus baseline and factors. The distinction matters: an exact inverse must restore prior state; a counterweight merely pushes the other way.
- **Derived behavioral tension** `adopted` `north-star`
  - A pure deriveBehavior({identity, role, appliedPatterns, worldState, operatorState, resources, episodeHistory}) computes the active tension at any moment, which determines selection probabilities, thresholds, prompt instructions, cadence, tool permissions, verification, communication style, and stopping behavior.
- **NoOp as first-class intent** `adopted` `north-star`
  - AgentIntent = Act | Wait | Observe | NoOp, where a NoOpIntent carries reason, evidence, next reevaluation cadence, and the condition that would make action useful — so doing nothing is a deliberate, explainable decision, not a crashed scheduler or an indecisive model. Directly answers Dylan's 'is it more helpful for me to do nothing?'
- **Per-action autonomy envelope** `adopted` `north-star`
  - Correction to Dylan's single upside-down-parabola: no global 'more absence = more authority' curve; each candidate action has its own U(a,t) = Benefit - Risk - Disruption - OpportunityCost, and is eligible only with positive utility, window fit, granted authority, rollback path, and a verification reserve. Prolonged absence degrades toward read-only research, proposals, tests, docs, or explicit NoOp — never 'a license for architectural vandalism.'
- **Presence-based resource priority reordering** `adopted` `north-star`
  - Explicit priority stacks for operator-present (foreground objective first, maintenance fourth) vs operator-absent (safety first, then finishing bounded work, then maintenance/entropy reduction, then research); maintenance is subordinated during scarce interactive periods but safety monitoring keeps a protected minimum.
- **Double Dutch pattern** `preserved` `recovered`
  - Dylan's jump-rope metaphor formalized as a guarded opportunity-window/rendezvous pattern: watch -> detect opening -> prepare -> enter bounded action window -> act -> exit before interference -> resume watching. GPT explicitly endorses keeping the friendly name.
- **5S as permanent maintenance organism** `adopted` `north-star`
  - Observe -> Sort -> Set in Order -> Shine -> Standardize -> Sustain as a recurring statechart with Safety as a parallel region, each S given concrete repo behaviors; Sort classifies with evidence and never deletes initially; Shine makes cleaning double as inspection (tests, type checks, broken links, flaky commands); goal: 'a repo that becomes slightly easier for both you and the next fresh Claude session to understand each day.'
- **Standardize as token economics** `preserved` `north-star`
  - When a useful repair recurs, convert it into a test, lint rule, hook, reusable skill, pattern card, or deterministic script — 'this is where Launchpad stops repeatedly paying model tokens for solved problems.' A sharp economic articulation of the compile-feedback pillar.
- **Commedia as relation topology with failure modes** `adopted` `north-star`
  - Masks treated as relationships rather than personalities, each annotated with formal function and characteristic failure modes: Whiteface (planner/rule-keeper; over-centralization, mistaking authority for correctness), Auguste (maker/improviser; scope drift, enthusiastic breakage), Contra-Auguste (falsifier; destructive contrarianism, loss of shared truth), Watcher (sense-maker). The failure-mode annotations are not in the north star.
- **Watcher as narrative projection** `adopted` `north-star`
  - Narrative = project(EventLog, Perspective): the Watcher (Dylan's added fourth character) consumes the event stream and produces derived narratives; multiple parallel watchers (architecture, security, product, operator-intent) create different narratives from the same events while the event log remains authoritative.
- **Lazzi as bounded sidecar library** `adopted` `north-star`
  - A lazzo is a bounded side routine with tight time budget, tight scope, explicit cancellation, no authority to redefine the main objective, and a clear handoff artifact; Dylan's constant fixers, bridge makers, gap pluggers, and tool builders are 'essentially a library of useful technical lazzi.'
- **Sandbox-only chaos with robust/antifragile classification** `adopted` `north-star`
  - The Chaos agent (Contra-Auguste) may mutate sandbox copies, inject test faults, reorder simulated events, and build adversarial fixtures — but never quietly degrade authoritative data. Responses are classified robust (perturbation absorbed, behavior intact) vs antifragile (missing invariant exposed, new test/monitor created, assumptions revalidated).
- **Verification radius** `preserved` `recovered`
  - Born from Dylan's 'spidey sense' intuition: a pure function of (anomaly, dependencyGraph, confidenceProfile) computes recheck scope — local / neighborhood / subsystem / full — so low-blast-radius errors get local fixes while high-centrality or invariant-violating anomalies escalate to cluster or subsystem audits.
- **Computed voice selection** `preserved` `recovered`
  - The six mitigated-speech levels (Command, Crew obligation, Crew suggestion, Query, Preference, Hint) chosen by a pure selector over risk, urgency, confidence, authority gap, reversibility, and cost of misunderstanding — while keeping linguistic force strictly separate from actual authority. Targets AI failure modes: hedging when explicit is needed, sounding authoritative when uncertain, burying warnings. The voice list and force/authority separation are in the north star; the computed selector mechanism is not.
- **Personality as computed phenotype** `adopted` `north-star`
  - An agent is not stored as one giant static system prompt; store ingredients (identity, role, cards, world, operator, resources, lineage) and compute the phenotype per episode — prompt fragments, initiative threshold, exploration ratio, permissions, cadence, stopping rule, context budget, escalation policy. The model session is 'one incarnation of that computed phenotype.'
- **Identity lineage with gated evolution** `adopted` `north-star`
  - Dylan's 'sum of a connected lineage of agent variations and actions' with drift control: Identity v7 -> episode outcomes -> observed behavior profile -> candidate v8 -> replay/sandbox evaluation -> approval or rejection; keep intended behavior, observed behavior, and candidate adaptation as three separate things — diachronic identity without silent in-place mutation.
- **Episode provenance and transcript policy cards** `adopted` `north-star`
  - From Dylan's source-vs-summary observation ('a summary can always be regenerated from a source; the source usually cannot be reconstructed from a summary'): an Episode schema with sourceInputs, toolEvents, outputs, evaluation, continuation; a menu of data policies (verbatim local, encrypted, deterministic scrubbing, summary-only, delete-after-N-days, exclude-from-learning); every derivative points back to its source; hidden chain-of-thought explicitly not a design dependency; the policy is inspectable before an episode begins.
- **Model identity as hard constraint** `adopted` `north-star`
  - Dylan's hard line against model degradation formalized: the required model is a constraint, not an economy lever — unavailable means pause, queue, or fail closed, never silently downgrade; budget instead varies across context size, tool turns, parallelism, research breadth, duration, candidate count, verbosity, verification depth, retries.
- **Progressive budget tranches** `preserved` `recovered`
  - Budgets released in stages — Probe (cheaply establish the task is real and scoped), Sow (research/fanout for options), Commit (implementation budget), Verify (a protected independent verification reserve), Recover (small retry/repair reserve) — with deliberately uneven distribution by task type (high-risk migration gets less speculative execution, much more verification).
- **429 as continuation transition** `preserved` `north-star`
  - Rate limiting is a statechart transition, not a stalled transcript: running -> rate limited -> persist continuation -> backoff rhythm -> resume in fresh session. 'The work does not remain alive merely because a transcript remains open.'
- **Analog completeness test** `adopted` `north-star`
  - 'Designed without AI' as a formal acceptance test: every core pattern must be explainable and enactable with people, index cards, task tokens, timers, resource chips, folders, message channels, rules, and state markers. 'If a proposed core feature only makes sense because an LLM can improvise around missing semantics, it does not belong in the core grammar.' Claude, a human, a shell script, a test runner, and a future model can occupy the same abstract actor slot.
- **Structurally honest silly UI** `adopted` `north-star`
  - Red pandas / minis are legitimate if their behavior is exact: every visual element maps to real state (mask=identity, hands=tools, speech bubble=voice, heartbeat ring=cadence, backpack=memory policy, energy bar=budget, tether=permissions, footprints=lineage), and dragging a card changes both the animation and the formal program. 'The friendliness is not hiding the machinery. It is giving the machinery several comprehensible projections.'
- **Deterministic composition precedence** `preserved` `recovered`
  - A visible nine-level precedence order for card conflicts: safety invariants > hard permissions > statechart guards > work-order obligations > resource budgets > policy scores/tensions > cadence > communication voice > visual skin. Soft cards on the same axis combine and display the result; conflicting hard cards reject the composition with an explanation. Examples: 'Command voice cannot create authority'; 'Explore cannot override a production-change prohibition.'
- **Four-mask 5S demo** `preserved` `recovered`
  - A first compelling v2 demonstration: Whiteface, Auguste, Contra-Auguste, and Watcher run one 5S maintenance cycle over one repository with six named cards (SMART gate, Explore/Exploit, Mitigated Speech, Operator Away, Verbatim Local, No Model Downgrade), single-use Claude invocations, and the run inspectable as minis, statechart, Morse view, function-table trace, event timeline, work orders, and Git artifacts. The north star deliberately narrowed this to a Repo-Gardener-plus-Seiri slice, but the fuller cast demo remains a good milestone-2-or-3 target.
- **Product tagline and framing** `preserved` `recovered`
  - The strongest positioning is not 'we use management analogies to explain AI agents' but 'Program AI teams using organizational ideas you already understand' — the business/personal-development shelf becomes an executable standard library; metaphors are the authoring language, the grammar makes them trustworthy, state machines make them observable, continuations make sessions disposable.

  *Coined terms:* **Continuation** — A serializable description of what remains to be done after the current result arrives; the residual Program left after each step executes.; **Cadence (Rhythm grammar)** — A composable temporal-algebra AST (Once, After, Every, Burst, Calendar, Window, While, Until, Gate, Sequence, Merge, Race, Repeat, Backoff) whose nodes emit domain events; cron is just one primitive within it.; **Analog completeness test** — Acceptance test that every core feature be explainable with people, index cards, task tokens, timers, resource chips, folders, message channels, rules, and state markers; features that only work because an LLM improvises around missing semantics are excluded from the core grammar.; **Double Dutch** — The friendly name for a guarded opportunity-window/rendezvous pattern: watch, detect opening, prepare, enter a bounded action window, act, exit before interference, resume watching.; **NoOpIntent** — A first-class do-nothing decision carrying a reason, evidence, a next reevaluation cadence, and the condition that would make action useful.; **Verification radius** — The computed recheck scope (local, neighborhood, subsystem, full) for an anomaly, derived purely from the anomaly, the dependency graph, and a confidence profile.; **Phenotype** — An agent's computed present behavior (prompt fragments, thresholds, permissions, cadence, budgets, stopping rules) derived from stored ingredients; a model session is one incarnation of it.; **PolarAxis** — A behavioral pair (e.g. research/execute, challenge/support) tagged with its relation type — inverse, complement, counterweight, or compensation — plus a baseline and contributing policy factors; an inverse must restore prior state, a counterweight merely pushes the other way.; **Lazzo / Lazzi** — A bounded, interruptible sidecar routine with tight time budget and scope, explicit cancellation, no authority over the main objective, and a clear handoff artifact.; **Whiteface / Auguste / Contra-Auguste / Watcher** — The four-mask topology: planner and rule-keeper; maker and improviser; falsifier and perturbation tester (sandbox-only); read-only observer producing narrative projections from the event log.; **Voice** — The computed message-explicitness level (Command, Crew obligation, Crew suggestion, Query, Preference, Hint), deliberately kept separate from actual authority.; **Autonomy envelope** — Per-action eligibility during operator absence via U(a,t) = Benefit - Risk - Disruption - OpportunityCost, replacing any single global absence-to-authority curve.; **Tranches (Probe/Sow/Commit/Verify/Recover)** — Progressive budget stages: cheap existence probe, research fanout, implementation grant, a protected independent-verification reserve, and a small retry/repair reserve.; **Typed sockets** — Explicit card slots on a mini or team (Purpose/Method, Mask/Role, Stance, Rhythm, Voice, Memory, Authority, Budget, Safety); cards carry scope and invalid combinations are rejected or require an explicit adapter.; **Three lenses** — Every pattern's synchronized familiar/formal/code representations, compiled from one PatternDefinition; the generated prompt is a downstream artifact.

## Chat 001

*Operator ask:* Dylan (admittedly not having read GPT's prior output yet) floats two instincts: (1) why not make the browser + Playwright + Claude the medium for all interaction, messaging, and state — exploiting DOM querying, localStorage, sessionStorage, web DB, network requests, and screenshot+OCR; (2) his environment at the time metered the interactive top-level session far more tightly than delegated execution, so he wants Claude using the least possible main-thread context and is curious about "single-use" sessions cleared after each use, each starting with a better, clearer, more up-to-date initial prompt and orientation.

- **Browser as the agent interaction medium** `adopted` `recovered`
  - Dylan's core instinct: interactions, messaging, and state between operator and agents should flow through the browser via Playwright and Claude, rather than through bespoke channels or direct session-to-session calls. GPT upgrades this to 'the browser is the shared operational environment, a protocol rather than a picture'.
- **Full browser capability surface as agent I/O** `transformed` `recovered` (narrowed by Resolution 5: browser is one adapter/rendering of the shared world, not the universal I/O substrate)
  - Exploit every browser-native mechanism as agent I/O: DOM querying via Playwright, localStorage, sessionStorage, web DB (IndexedDB), network requests, screenshots plus OCR. The north star only uses DOM/screenshots as verification evidence, not as the general I/O substrate.
- **Minimal main-thread context** `adopted` `north-star`
  - Make Claude consume the least possible main-thread context, while accepting hooks/rules/skills where needed for safety or ergonomics. Directly in the north star as 'a small main-thread context footprint' and the compact-envelope success criterion.
- **Single-use sessions with fresh orientation** `adopted` `north-star`
  - Dylan's question: since sessions are stateless model-side and just accumulate raw transcript, why not use a new session each time with a better, clearer, more accurate, more up-to-date initial prompt and orientation. This is axiom 4 of the north star (fresh task-scoped sessions are normal).
- **Gateway cap asymmetry drives routing** `transformed` `north-star`
  - Execution channels can be metered asymmetrically — the interactive top-level session more tightly than delegated execution — so work should be routed off the main thread. The north star covers this via Milestone 0 capability discovery and empirical mechanism selection.
  - *Generalized:* Execution channels have separately metered budgets and limits; the orchestrator should know each channel's accounting and route work to preserve the scarcest channel — typically the interactive top-level session — regardless of provider or gateway.
- **Blackboard architecture and stigmergy** `preserved` `recovered`
  - Agents need not converse directly: they modify a shared environment, others observe the modifications and act, and the environment determines which actions are currently available. Makes all coordination visible, replayable, inspectable, statechart-governed, and independent of any transcript.
- **Persistent identity, disposable incarnation** `adopted` `north-star`
  - Explicit split: launchpad state, identities, roles, workstreams, decisions, and event history are persistent; Claude sessions, subagents, task prompts, Playwright tabs, and working memory are disposable. 'A session dies; the work does not lose its identity or memory.'
- **Semantic agent protocol routes** `preserved` `recovered`
  - Dedicated agent-facing URLs (/agent/tasks/T-193, /agent/sessions/I-482) serving deliberately engineered sparse HTML with protocol/version data-attributes, a machine-readable task contract, and data-testid action buttons — a compact vocabulary designed for Playwright consumption.
- **Statechart-gated affordances as enforcement** `preserved` `recovered`
  - The statechart decides which controls exist or are enabled, so the page itself expresses the legal action vocabulary of the current state; an agent cannot claim a task because it never sees an enabled Claim button. 'Much stronger than hoping a prompt rule is followed' — a concrete DOM-level mechanism for the north star's axiom 5 (hard constraints outside the model), which the doc states only abstractly.
- **Dual projections of one state** `preserved` `north-star`
  - A rich human UI (PrimeNG boards, grids, diff viewers, timelines, statechart visualizations) and a sparse semantic agent UI (one assignment, one context capsule, few actions, one result form) consume the same underlying state; never force an agent to parse an 80-row dashboard. North star has only the one-line 'human and agent-facing UI' in the console app.
- **Playwright MCP vs CLI-skill split** `preserved` `recovered`
  - Use Playwright MCP for exploratory browser work and visual investigation, but a Playwright CLI plus a narrow launchpad skill for frequent predictable operations (open/claim/heartbeat/report), since accessibility-tree snapshots are token-verbose; the interaction still happens through the browser with a compact action vocabulary.
- **Browser storage role mapping** `preserved` `recovered`
  - Each browser storage mechanism gets a specific role rather than acting as an undifferentiated database: sessionStorage for tab-local session ID/lease/drafts, localStorage for preferences, IndexedDB for local event cache and offline queue, BroadcastChannel for same-origin tab notifications, SharedWorker as in-browser broker, Service Worker for offline/retry, and server-side SQLite/JSONL as the authoritative store.
- **IndexedDB-first prototype path** `preserved` `recovered`
  - For a personal prototype, the whole database can be an Angular PWA with an IndexedDB append-only event store, BroadcastChannel, one persistent Chromium profile, and Playwright — provided it supports event-log export/import, periodic JSONL backup, navigator.storage.persist(), and schema migrations, because browser storage is best-effort and evictable. Graduate to a small Node service with SQLite/JSONL before concurrent valuable repo work.
- **Tiny local daemon as native actuator** `preserved` `north-star`
  - A minimal local Node process bridges what browser JS cannot do: spawn Claude Code, create Git worktrees, run tests, terminate hung sessions, persist SQLite/JSONL, stream events back. It exists because something must stay alive across browser refreshes, 429s, crashes, and lease expiries. Matches the north star's control-plane daemon.
- **Isolated browser context per worker** `raw` `recovered`
  - A persistent Playwright profile can be used by only one browser instance, so concurrent workers cannot naively share one. Model A (one shared browser context, one tab per worker — a literal browser blackboard) is prototype-acceptable but races; Model B (one isolated context per worker, shared state traveling through the launchpad server) is the recommended topology.
- **Perception cost hierarchy** `preserved` `recovered`
  - Use the cheapest, most exact representation first: structured task state, then semantic DOM/accessibility tree, then network/event info, then screenshot, then OCR. Screenshots/OCR are perceptual tools for visual regression and pixel-trapped text, not the default messaging channel when you own the app and can expose exact structured text. Distinct from the north star's evidence-strength ordering, which ranks proof, not perception cost.
- **Model-stateless, app-stateful session model** `preserved` `north-star`
  - Claude is stateless at the model level; Claude Code reconstructs context each request (with prompt caching and eventual compaction). A fresh session loses raw history, tool results, and stale corrections, but retains or rediscovers repo files, Git state, CLAUDE.md, rules, skills, MCP config, auto memory, and launchpad state — exactly why externalized workstream memory is powerful.
- **Task/phase-scoped sessions, not per-turn disposal** `adopted` `north-star`
  - Correcting Dylan's 'clear after each time': the disposal unit is one coherent task or phase per session (plan session P-17, implement I-42, verify V-08, repair R-11 tied by a persistent workstream), because per-turn clearing forces rediscovery of open files and hypotheses. Phase boundaries also give a natural adversarial separation between implementation and verification.
- **Continue-vs-replace session heuristics** `preserved` `recovered`
  - Explicit policy lists: continue while one coherent task, relevant recent reads, an edit-test-debug loop, or a valid hypothesis persists; replace when the role changes (planning to implementation to review), after multiple failed approaches, after correcting the same misunderstanding twice, when context fills with irrelevant logs, or when canonical workstream state is more current than the conversation. A compilable session-lifecycle policy absent from the north star.
- **Compiled context capsule (WorkOrder)** `adopted` `north-star`
  - Never handcraft giant initial prompts: the launchpad compiles a typed WorkOrder (task/workstream/identity/role versions, repo and base commit, objective, known facts, constraints, non-goals, dependencies, completion gates, allowed/prohibited operations, output contract) from authoritative state, and the actual launch prompt shrinks to a few lines pointing at the task page. Orientation lives in the environment, so a replacement session gets a more current picture without inheriting the predecessor's errors.
- **Main thread as airlock with context firewall** `adopted` `north-star`
  - The main thread must not explore repos, read files, ingest logs, or hold history; its job is intent capture, workstream creation/amendment, dispatch, receiving tiny completion envelopes, and requesting human judgment. Three-tier context firewall: worker contexts may be huge, the launchpad retains structured durable results, the main thread receives only IDs, status, and concise conclusions.
- **Compact result envelopes** `preserved` `north-star`
  - Delegated work returns a deliberately tiny structured envelope (taskId, status, resultId, one-line summary, requiresHuman flag); the full report, file lists, commands, test results, and reasoning live in the launchpad, referenced by ID.
- **Headless one-shot workers via CLI** `preserved` `north-star`
  - Routine work can bypass the main thread entirely: claude --bg --agent for background custom agents, or print-mode with --output-format json, a JSON schema for validated output, --strict-mcp-config for an approved tool surface, and --no-session-persistence for genuinely disposable runs. Avoid --bare as normal worker mode because it strips hooks, skills, memory, and CLAUDE.md — exactly the safety and ergonomics being kept.
- **Fresh sessions are not a rate-limit bypass** `transformed` `north-star`
  - New sessions fix context contamination, compaction loss, and stale assumptions but not account-level request limits, gateway token limits, or main-thread-specific metering; a cold session may even cost more because it forfeits prompt cache and must rediscover files. Treat routing as an empirical problem: record mechanism, model, top-level vs delegated, tokens, turns, 429 counts, retries, and rework per execution, benchmark one representative task across every route, and let the launchpad learn the least-constrained route per task class.
  - *Generalized:* Instrument every episode with execution-mechanism and resource telemetry and learn per-task-class routing empirically for whatever provider, gateway, or limit regime the system runs under, instead of assuming session hygiene changes accounting.
- **429 handling inside the statechart** `preserved` `recovered`
  - A worker is not 'failed' because the gateway rejected it: model rate_limited as first-class lifecycle states (waiting, retrying, reassigned, escalated), honor retry-after with jittered backoff, avoid waking all waiting workers at once, retry from the persisted work order rather than human memory, optionally in a brand-new disposable session, reusing the worktree if consistent or dispatching a recovery/inspection worker if not. The north star has a Backoff cadence primitive and 429 telemetry but not this lifecycle mechanism.
- **Leases, idempotency keys, and heartbeats** `raw` `recovered`
  - Every work operation carries task version, claim lease, idempotency key, attempt number, last committed event, base commit, worktree path, and result references; workers post heartbeats through the browser and leases expire so a vanished worker never destroys the workstream. Distributed-systems hygiene GPT added that Dylan never raised.
- **Browser-centric first vertical slice** `preserved` `north-star`
  - One task created in Angular, one fresh worker opens and claims it through Playwright, edits one repo, posts heartbeat and completion through the browser, exits, the launchpad retains complete state, and a second fresh verifier independently reviews — validating browser-as-world, disposable sessions, Playwright ergonomics, permissions, context consumption, and gateway rate behavior before building the identity system. The north star's own slice is a richer variant (Repo Gardener/Seiri/cadence) sharing the browser-claim and independent-verifier skeleton.
- **Operator as slowest consumer** `preserved` `north-star`
  - Dylan's aside — 'you are a slower producer and i am an even slower consumer' — names operator reading bandwidth as the binding constraint of the whole system: agents produce faster than the human can review, so output must be compressed, prioritized, and evidence-backed. Implicit in the north star's operator-burden and bottleneck-flow axiom but never stated as the consumption-bandwidth asymmetry.

  *Coined terms:* **single-use sessions** — Dylan's coinage: Claude sessions cleared after each use, replaced by fresh sessions each given a better, clearer, more accurate, more up-to-date initial prompt and orientation.; **main thread** — The top-level interactive session, typically the scarcest execution channel, distinct from delegated mechanisms.; **blackboard architecture** — Coordination model in which agents do not converse directly but modify a shared environment that other agents observe and act on; the environment determines which actions are currently available.; **stigmergy** — Indirect coordination through traces left in a shared environment, the element GPT layers onto the blackboard model.; **browser as protocol, not merely a picture** — The browser is an engineered machine-readable interaction protocol for agents (semantic routes, data attributes, gated controls), not just a dashboard humans look at.; **human projection / agent projection** — Two renderings of the same underlying state: a rich PrimeNG dashboard for humans and a sparse semantic DOM for agents.; **context capsule / work order** — A compiled, current orientation for a fresh session, generated from authoritative launchpad state (typed WorkOrder interface) instead of a handcrafted giant prompt; the launch prompt shrinks to a pointer at the task page.; **context firewall** — The layering that keeps huge source reads and logs in worker contexts, structured durable results in the launchpad, and only IDs, status, and concise conclusions in the main thread.; **airlock (main thread as)** — The main thread's reduced role: understand intent, create/amend a workstream, dispatch, receive a tiny completion envelope, ask for human judgment only when needed.; **disposable incarnations** — Claude sessions as temporary embodiments of persistent identities and workstreams rather than long-lived containers of institutional memory; 'a session dies; the work does not lose its identity or memory'.; **result envelope / completion envelope** — The deliberately tiny structured JSON (taskId, status, resultId, summary, requiresHuman) returned to a parent session while full artifacts stay in the launchpad.; **one coherent task or phase per session** — The session-disposal granularity rule: disposable sessions, not disposable turns — clearing per exchange would force rediscovery of open files and hypotheses.; **browser blackboard** — The literal Model-A topology where all workers share one browser context and immediately see one another's storage and DOM changes.

## Resolutions of known tensions

These are the corpus's internal contradictions, resolved once, here, so no
future session relitigates them (see decision records for full rationale):

1. **Five-way founding tournament (chat 010) vs. collapse (chat 011).**
   Resolved: CLOSED. The tournament already ran in blended form and converged
   (ADR-0001). Tournament-machinery ideas (architecture packets, blind
   submissions) stay `preserved` for future architecture-scale decisions.
2. **Comprehensive capability audit vs. bounded toolchain inspection.**
   Resolved: environment-dependent. On this personal Mac a bounded inspection
   (WO-001) suffices; the full audit prompt remains preserved for constrained
   environments where the runtime is wrapped or metered.
3. **Full-context bootstrap on v1 vs. clean-room.** Resolved: the personal
   build is clean-room BY CONSTRUCTION (v1 is not present here and never will
   be). This blueprint corpus replaces v1 as bootstrap competence. The
   strangler experiment still runs: typed mechanisms progressively absorb the
   blueprint's prose. (ADR-0001)
4. **Ticket-to-PR as the product vs. agentic core as the product.** Resolved by
   the operator directly: the personal build centers agentic communication and
   the kernel; ticket-to-verified-PR remains a supported vertical behind
   SourceAdapter/WorkOrderTransport ports. (ADR-0002)
5. **Playwright/browser as universal task bus vs. transport-neutral dispatch.**
   Resolved: WorkOrderTransport is the port; browser-as-shared-world is one
   adapter (and a strong one for verification), chosen empirically per
   environment.
6. **Absence as a mandatory authority brake vs. progressive unattended
   autonomy.** Resolved: presence and recorded elapsed absence are policy
   inputs, not grants with a universal direction. A declared PresencePolicy may
   hold, shrink, grow, peak, reset, or loop attention, work scope, and effect
   authority independently within its source grant and ceiling; external
   capability remains independently observed. Without a declared transition,
   the affected axis holds. Earlier categorical no-growth clauses remain
   historical and are superseded by ADR-0007.
