# WO-004 — Environment truth addendum and lifecycle corrections, v0.2.1

**Model:** any capable model.
**Release classification:** `v0.2.1` patch — compatible evidence corrections
and lifecycle/release hardening over the published `v0.2.0` source release.
**Depends on:** WO-001 for the original `docs/discovery/` deliverable; WO-003
for the operator-authorized lifecycle addendum, which hardens the workflow and
release boundary first exercised by `v0.2.0`. Unblocks the v0.5.0 adapter
choice, whose recommendation originally rested on `documented locally` rows.

**Cites (read these sections):** WO-001-environment-truth.md (authority model
and classification labels); docs/discovery/environment.md §Recommendations for
the real-worker milestone and §Corrections and known gaps (the deferred-gap
list this order closes); 01-principles.md Principle 15; 06-roadmap.md v0.5.0.

**Objective:** Close the gaps WO-001 recorded and deliberately left open, so
the v0.5.0 transport recommendation rests on `observed` evidence: the two
candidate transport launch shapes exercised for real, MCP as a capability row,
full startup-context accounting, effective settings loading, and the
user-level `model` key. Original discovery-slice timebox: ~45 min; the later
operator-authorized expansions below are outside that timebox. Unknown remains
an acceptable result; every claim carries an epistemic label.

**Authority:** read-only inspection plus writes under `docs/discovery/` only.
One smoke invocation per transport shape IS permitted and required to attempt
— run from a normal authenticated session, not a network- or keychain-denied
sandbox (the established cause of WO-001's blocked rows). No package
installation, no config mutation, no secret values (env var and settings KEY
NAMES only), no rate-limit probing.

**Checklist (each item gets a classification):**
1. Claude CLI print transport observed end-to-end with the canonical launch
   shape: print mode, explicit model + effort, JSON output + schema, no
   session persistence, project+local setting sources, ambient auto-memory
   disabled. Record the exact command, the result envelope shape, and which
   flags behaved as their locally documented help states.
2. Codex CLI exec transport observed end-to-end: ephemeral, sandbox level,
   JSONL events, output schema, explicit model. Same recording duty.
3. MCP as a capability: `mcp`, `--mcp-config`, `--strict-mcp-config`,
   connected servers by name.
4. Startup-context accounting completed beyond `CLAUDE.md`: every auto-loaded
   category the `--safe-mode` help enumerates (skills, plugins, hooks, MCP
   servers, commands, agents, output styles, workflows, themes, keybindings),
   per file, line/byte metadata only.
5. Effective settings loading: which sources actually load and in what
   precedence (`--setting-sources`), including the managed/policy source and
   `~/.claude.json`; the user-level `model` key recorded (key names only).
6. `environment.json` gains a counterpart row for every finding, including
   the missing Codex feature-surface row.

**Deliverables:** a dated addendum section in `docs/discovery/environment.md`
(correction-log style, every command recorded) plus the updated
`environment.json`.

**Evidence gate:** every checklist item classified; the v0.5.0 recommendation
re-stated over `observed` rows (or explicitly re-labeled still
documented-only, with cause — an acceptable finding); 06-roadmap.md's v0.2.1
line already points at this order.

**Non-goals:** building adapters; benchmarking; rate-limit probing;
background/workflow/MCP transport prototypes; changing the ADR-0002 executor
decision; package/framework selection; work-machine anything.

## Operator-authorized lifecycle hardening addendum (2026-08-31)

The operator expanded WO-004 after the v0.2.0 closeout exposed a gap between
the documented lifecycle and the workflow a fresh executor can actually run.
The latest operator clarification is the outcome authority for this addendum:

1. Final review produces one ordinary work-order PR for the operator to merge.
2. After that merge, one guarded release-close command updates the main
   checkout, installs exact locked dependencies, reruns release evidence,
   generates and validates release notes plus the compatibility manifest, and,
   when the application release target is a new boundary, creates and pushes the
   annotated tag under explicit command-line authorization.
3. The successful command leaves a clean main checkout in the closed,
   between-work-orders state. An application target in a work-order heading
   strictly below the latest release tag is an honest no-release result, not
   an attempt to publish backwards. An equal version succeeds only as an
   idempotent rerun when the existing validated annotated tag names the exact
   current commit; a mismatch refuses. WO-004's retimed `v0.2.1` is a forward
   patch boundary.
4. `worktree start` accepts a valid next work order, then creates and activates
   its isolated worktree. It prints the exact directory and handoff commands;
   the operator manually changes directory and opens Codex. WO-004's
   `worktree start` projection does not launch Codex or another interactive
   process automatically. This is a present workflow choice, not a durable
   prohibition on DotLn launching governed workers in later milestones. The
   operator's only in-session dispatch is then `resume: next`.
5. In phase `active`, `resume: next` resolves to the active work-order path and
   the executor instruction. In phase `closed`, the same phrase reports that
   the repository is between work orders and points to `worktree start`.
6. The playbook presents chat phrases as the primary interface. In particular,
   `resume: final review` includes the authority to complete a passing final
   review, commit the reviewed state, push the work-order branch, and open the
   mergeable PR; `resume: release close` includes the authority to run the
   guarded post-merge close and publish its validated annotated tag. The
   operator still merges PRs and manually runs `worktree start`, `cd`, and
   `codex` for the next work order.

The original discovery deliverable remains the first implementation slice and
must be checkpointed separately before lifecycle code so verification can read
its diff independently. Recording this authority before that slice is a
bootstrap necessity; it is not permission to mix the two implementations.

### Release projection decision

Forward releases store the generated compatibility manifest and layered notes
in the annotated tag message. That is the only projection that can bind them
to the exact post-merge commit, push no commit directly to protected `main`,
avoid a second release-notes PR, and finish in one command. The checked-in
v0.2.0 manifest and notes remain immutable historical artifacts. The release
command may archive evidence in disposable local storage while it runs, but a
successful release is reconstructable from the tagged commit and tag object;
it must leave no tracked or untracked residue in the checkout.

Release preparation is idempotent and derives progress from repository and
remote tag state rather than adding transient release phases to the tracked
work-order log. A rerun after interruption must either continue safely or
refuse with the exact conflicting state. `closed` therefore remains the durable
between-work-orders phase instead of becoming a dirty main-checkout event.

### Additional authority and constraints

This addendum authorizes changes to `scripts/resume.mjs`,
`scripts/worktree.mjs`, new bounded release tooling and fixtures, `package.json`,
the execution guide, playbook, roadmap release contract, and idea ledger in
addition to WO-004's original `docs/discovery/` authority. It does not
authorize merging PRs, pushing directly to `main`, publishing packages or
binaries, changing repository settings, or creating/pushing a tag except when
the operator later invokes the release command's explicit publish form or the
documented `resume: release close` phrase. The documented `resume: final
review` phrase is explicit authority to push the work-order branch and open its
PR after a passing review; it is never merge authority.

The start command must print shell-safe, absolute handoff commands for the new
worktree, including `cd`, `codex`, and the phrase to enter after Codex opens.
This projection must not inspect, preflight, or invoke the Codex executable;
future worker-launch automation remains in scope for the roadmap when its
authority and lifecycle are explicit. Missing GitHub tooling must still fail
before the first remote mutation that requires it.

### Acceptance evidence

- Resume lifecycle tests exercise both meanings of `next`: `active` prints the
  exact work-order path and exits zero without appending; `closed` retains the
  existing between-work-orders behavior. Illegal transitions print concise
  corrective commands without a raw JavaScript stack trace.
- The execution guide and `docs/PLAYBOOK.md` lead with the chat-command path
  for every agent phase and reserve raw console commands for the operator's
  merge, worktree start, directory change, and Codex launch. The final-review
  and release-close phrases state their external-effect authority explicitly.
- Worktree fixture tests prove `start` creates and activates the new worktree,
  prints its shell-safe absolute `cd` command, then prints `codex` and
  `resume: next`; the test also proves no Codex executable is invoked.
- Publish refuses a missing `gh` executable before pushing the branch, and
  merged-worktree finish succeeds when the local WO branch never had an
  upstream; both formerly observed half-mutation defects have fixture tests.
- Release fixture tests cover dirty checkout, non-main invocation, local/main
  divergence, dependency-install failure, evidence failure, malformed or
  non-increasing versions, existing/conflicting tags, and push failure. No
  refusal path creates or pushes a tag.
- A success fixture starts with no `node_modules`, proves `npm ci` and the full
  evidence gate leave tracked files unchanged, validates every generated
  manifest field against the tagged commit, creates one annotated tag only
  under the explicit publish form, pushes only that tag, and exits with a clean
  checkout.
- Validator mutations fail independently for commit identity, application and
  component versions, toolchain versions, schema ranges, evidence results,
  and the evaluable/deferred cadence lists that were misstated during the
  manual v0.2.0 closeout.
- The generic lower-version fixture proves a no-release close leaves the clean,
  closed main checkout ready for the next `worktree start` without creating a
  backwards SemVer tag. The forward success fixture exercises WO-004's retimed
  `v0.2.1` release path.
- Before `implementation-ready`, the implementer runs a separate local
  hardening review that does not allocate a `VER-NNN`: executable evidence,
  adversarial and mutation probes, senior code-quality review, staff-level
  workflow/failure-mode review, and principal-level architecture, authority,
  and compatibility review. Findings are repaired, the affected focused tests
  rerun, and the full suite rerun before the independent verifier is dispatched.

### Deferred from the supplied draft

The earlier supplied closeout-hardening draft contained truncated clauses
outside this clarified lifecycle outcome. Intake reconciliation, checkpoint
retention/recovery, wider publish/finish hardening, raw evidence publication,
and branch-ruleset API preflight remain follow-on candidates unless required
by the acceptance evidence above. Their missing text is not reconstructed here.

## Post-implementation ideation breakout receipt (2026-08-31)

The operator opened an ideation interval after WO-004 reached
`ready-to-verify`, then explicitly requested the normal durable synthesis. This
receipt expands the independent verifier's documentation subject; it adds no
runtime implementation, allocates no `VER-NNN`, and does not move the control
phase or resume execution.

- **Raw intake:**
  `docs/intake/notes/WO-004-expanded-ideation-2026-08-31-ui-profiling.md`
  remains gitignored and is not a committed source of product truth.
- **Lineage:** `docs/lineage/idea-ledger.md` §WO-004 post-ready ideation batch
  001 appends four dispositions: plural UI hosts; the conditional
  operator-fluent Angular baseline; the plain-workspace/Nx boundary; and
  profiling work orders for code counterfactuals.
- **Durable product surfaces:** `docs/product/04-interfaces.md` §Plural UI
  hosts, one projection contract and `docs/product/06-roadmap.md`
  §Counterfactual profiling work orders, plus the v0.8.0 projection wording.
- **Unchanged surfaces:** no ADR, schema, package dependency, application code,
  or tooling implementation was added by this breakout.

Adopted requirements are that multiple UI forms share one canonical domain and
that code-efficiency counterfactuals have correctness-gated, repeatable,
machine-readable profiling work orders. Preserved choices are whether to build
the spatial view with Babylon.js; whether the conventional shell actually uses
Angular; which of the familiar Angular libraries earn their cost; whether
Transloco or another catalog owns UI copy; whether representative evidence
justifies Nx over the default plain workspace despite reported daemon
reliability concerns; and the
eventual profiling schema, statistical method, thresholds, roadmap placement,
and candidate-selection authority.

Review this breakout for clean-room rewriting, accidental hardcoding of
conditional stack choices, framework leakage into the pure kernel, metric
comparability, correctness and authority preservation, and any implication of
automatic candidate promotion. Confirm that the profiling design connects the
existing efficiency vector to the earlier graded-counterfactual-build lineage
without duplicating or silently replacing either, and confirm the raw intake
file remains ignored.

### Ideation batch 002 — potential work-order intake

The operator then asked whether potential work orders should arrive through
agent-authored PRs and evidence, GitHub Issues or Discussions, or files in the
repository. The synthesis treats those as maturity layers rather than mutually
exclusive choices.

- **Raw intake:**
  `docs/intake/notes/WO-004-expanded-ideation-2026-08-31-work-order-intake.md`
  remains gitignored.
- **Lineage:** `docs/lineage/idea-ledger.md` §WO-004 post-ready ideation batch
  002 records the layered intake projection, proposal-merge semantics, and the
  separation between proposer and independent evidence.
- **Durable product surfaces:** `docs/product/03-architecture.md`
  §Channel-plural intake, PR-backed registration and
  `docs/product/04-interfaces.md` §Suggestion and proposal review.
- **Unchanged surfaces:** no proposal schema, `docs/proposals/` implementation,
  GitHub configuration, automation, runtime code, or control transition was
  added.

The adopted projection is that early conversation can remain in Issues,
Discussions, chat, or an application surface; mature proposals use PR review
to add a normalized in-repo packet; merging registers a durable planning
candidate only; and a separate operator-authorized planner compiles a real
WorkOrder. Unresolved implementation choices include the exact packet schema,
GitHub feature availability, safe CI for executable evidence, retention and
deduplication of unmerged submissions, and whether disposition changes use the
same PR or a later append-only event.

Verification must confirm that no transport is mistaken for canonical
authority, no proposal merge can schedule work, proposer evidence is clearly
distinguished from independent verification, untrusted PR execution receives
no secrets or mutation authority, rejection/defer reasons survive, and the
new projection remains consistent with `ProductSuggestion` and the existing
operator-only promotion rule.

## VER-001 repair authority and hardening receipt contract (2026-08-31)

VER-001 returned WO-004 to bounded repair. This repair may change the two Git
push sites and their fixtures, the resume checkpoint projection and fixture,
the discovery Markdown/JSON parity surfaces, lifecycle and release docs,
`docs/product/10-ir-compatibility.md`, `docs/verifications/README.md`, and this
work order. It may add one
implementer-owned hardening receipt under `docs/verifications/WO-004/`; that
receipt is evidence, not an independent `VER-NNN`, and does not change the
control phase. This addition explicitly covers the compatibility document
that the original lifecycle authority list omitted.

The durable artifact required by acceptance-evidence bullet 9 is
`docs/verifications/WO-004/HARDENING-001.md`. It records the pre-verification
hardening actually performed, including executable evidence, adversarial and
mutation probes, senior code-quality review, staff workflow/failure-mode
review, principal architecture/authority/compatibility review, repairs made,
and the focused plus full-suite reruns. The receipt describes the historical
timing honestly: the artifact contract was added during VER-001 repair rather
than fabricated as though it existed before the first
`implementation-ready` transition.

The required repair outcomes are: both authorized pushes opt out of following
tags and prove the exact remote-ref result; the one-time WO-004 release
bootstrap and ordinary later closeout are both executable from their printed
handoffs; the PR publication command is durable and reachable from a passing
final review; and discovery row classifications agree across Markdown and
JSON. A failed checkpoint must never leave an older destructive restore
command advertised as current.

## Ideation batch 003 — version and documentation synchronization (2026-08-31)

After the VER-001 repair reached `ready-to-verify`, the operator explicitly
expanded scope to every work order and all repository documentation, requested
a clearer RPG analogy and a more ambitious public README, and required
independent counter-review with a warning against naive interventionism. This
receipt expands VER-002's subject without allocating a verification artifact or
moving the control phase.

- **Raw intake:**
  `docs/intake/notes/WO-004-expanded-ideation-2026-08-31-version-documentation-sync.md`
  remains gitignored. It preserves the operator's requests; committed prose is
  a fresh synthesis.
- **Lineage:** `docs/lineage/idea-ledger.md` §WO-004 post-ready ideation batch
  003 records the forward-only application retiming, the whole-stash metaphor
  supersession, and the README's public-front-door contract.
- **Application releases and work orders:** current and pending headings plus
  their current cross-references are retimed monotonically from WO-004
  `v0.2.1` through the `v0.10.0` source vertical. The roadmap contains the
  dated old→new map and the maintenance-versus-capability rationale. Published
  tags, release records, numbered verification/final-review/hardening reports,
  earlier ledger entries, component versions, and schema versions remain
  unchanged.
- **Durable documentation surfaces:** root `README.md`, `docs/README.md`, the
  playbook, release-record guide, discovery environment/runtime maps, ADR-0002
  amendment, product docs 00, 02–07, and 10, package skeleton README, and every
  WO-001–WO-011 document were reviewed or corrected where evidence required.
  This list is explicit so later verification need not infer the breakout's
  authority from the diff.
- **Operator-authorized presentation behavior:** the skeleton banner now
  identifies `@dotln/skeleton v0.2.0` instead of presenting that component
  number as the advancing DotLn application version. This is an observable
  one-line CLI-output change, exercised by `npm run skeleton`; it changes no
  domain decision, effect, schema, package version, dependency, control event,
  release fixture, or release-helper algorithm.
- **Unresolved choices:** this synchronization introduces none. WO-005 and
  WO-006 retain an execution-time classification gate: if either expands from
  documentation, evidence, or internal tooling into exported application
  capability, its application target must be reclassified before
  implementation.

The chosen version intervention is deliberately bounded. Unpublished targets
may move only under explicit operator authority with a dated migration note;
immutable published history may not. This receipt brings WO-004's active
scope, acceptance, and independent-review subject along with its retiming.
WO-005 and WO-006 remain patch targets only while they stay
documentation/evidence/internal-tooling work, and must be reclassified before
implementation if their scope adds exported application capability. The
existing release helper still derives the application target from the sole
SemVer in the work-order heading; the retiming therefore changes WO-004
closeout from an obsolete backwards/no-release expectation to the planned
forward `v0.2.1` patch without inventing another version axis.

The explanatory metaphor is now “the whole stash into every map,” sharpened as
“every support linked to every skill” and followed by a plain-English account
of irrelevant context and unintended interactions. Historical `aura stacker`
ledger language remains history, while an explicit, visible-cost team aura
remains a valid domain mechanic.

VER-002 must review the actual expanded diff for: clean-room rewriting; the
old→new version map and strict roadmap ordering; SemVer classification;
work-order dependencies and citations; current-versus-planned README claims;
the distinction among application, component, schema, artifact, and work-order
identity; discovery status against recorded observations; exact parity of all
resume-intent inventories; release-close side effects and lower/equal-version
wording; local Markdown links; and preservation of every immutable historical
artifact. It must also account for the independent read-only audit and the
post-edit counter-review rather than treating agent agreement as evidence.
