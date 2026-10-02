# WO-073 — Repository class and profile documents: a class is a link group of supports and checks every member equips, a profile document per registered repository is loaded on demand by the role skill, and policy layers launchpad → class → repository (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. Configuration semantics and a generated
skill change; no runtime package change beyond the skill render. Assigned
at activation under the standing opt-out default.
**Cost:** adds a class declaration (its checks and supports) and its
application where a registered profile is applied today
(`scripts/lib/authority-grants.mjs`), a profile convention with its
document root, an activation refusal for an unreadable profile in
`scripts/resume.mjs`, one sentence in the role procedure
(`packages/skeleton/src/loadouts/contributor.ts`) and the regenerated
bundle, fixtures, one write-back each in product 03 and product 07, and
two optional declarations on a registration, machine-user logins and
admitted link hosts, read by the pull-request observer through the target
request (`scripts/lib/pull-request-observer.mjs`,
`scripts/lib/target-publish.mjs`). Removes the opaque class name every
registration must declare today and nothing reads, and the stop a
repository's review bots cause when they run as user accounts or link to
another host. WO-083 depends on it. Re-mints: deterministic, the
authority, feedback and harness editions that `contributor.ts` stales and
the regenerated bundle; the feedback edition by carry, since that file is
not among the sources the feedback verifier judges; no live episode.
`scripts/lib/config.mjs` is excluded from every inventory with a recorded
reason. A class check compiled in `packages/compiler/src/verification.ts`
or `feedback.ts`, which the verifier judges, would owe a live episode the
executor runs; the Design keeps the checks in the host
adapter. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-033 phase 2 (class and profile), cut into a
bounded child at the operator's 2026-09-08 correction; the founding notes'
scope layering. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition. Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec`: class
checks join the compiled `requiredEvidence`, layers compose under the
monotone floor, the cold-start claim is a bounded growth instead of none,
and the product 07 section is named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Amended by the 2026-10-02 planning pass at `08845c71`: the
registration's machine-login and link-host declarations are added as
criterion 4 (WO-065 D015, register row FUP-b20c90983e966131, decided
there), the byte figures leave the criteria, and the duties this order
owes are gathered under Known issues and carry-ins
([planning document](../planning/standard-pass-2026-10-02.md) §6 and
§9).
**Depends on:** WO-071 merged (the registration the class and profile attach
to; closed, v0.38.0); WO-167 merged (product 07 holds 9 bytes of headroom
until the fold resets its ceiling).
**Recommended placement:** the delivery lane of the seventh pair, beside
WO-191, after WO-072 and before WO-076. This order edits
`scripts/lib/config.mjs`, `scripts/lib/authority-grants.mjs`,
`scripts/lib/pull-request-observer.mjs`, `scripts/lib/target-publish.mjs`,
the target activation in `scripts/resume.mjs`, the role procedure in
`packages/skeleton/src/loadouts/contributor.ts` and the bundle, a new
profile root with its README, product 03 and product 07. WO-072 edits
`scripts/resume.mjs` and product 07 before it; WO-187 and WO-188 edit
`contributor.ts` earlier in the sequence, and WO-191, beside it, adds
one reviewer and one planner sentence there. Target-application profiles (the
operator's Angular repository among them) are authored in the fork that
owns them, never here. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "the registration the class and profile attach to"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "product 07 has 9 bytes of headroom until the fold resets its ceiling"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 01-principles.md Principle 17 (repo-native
authority); 03-architecture.md §Agent enablement skills (the preload
compiled from the WorkOrder, role, loadout and envelope);
07-execution-guide.md §Where the control plane finds its documents (the
opaque `repositoryClass`, the monotone floor, the root and section lists)
and §Discipline (the cold-start ceiling route);
`packages/compiler/src/harness.ts` (the skill render);
`packages/skeleton/src/loadouts/contributor.ts` (the role procedure text);
`packages/compiler/src/types.ts` (`WorkOrder.requiredEvidence`);
`scripts/lib/authority-grants.mjs` (`applyRegisteredRepositoryProfile`);
`scripts/lib/config.mjs`; `scripts/lib/process-budget.mjs` and
`docs/control/budgets.json`; `docs/evidence/WO-071/decisions.md` D001;
`docs/evidence/WO-119/decisions.md` D001; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history only
(the Design bullet led "Phase 2 — target repositories are builds, not just
paths.").

**Objective:** A registered repository names a class (the loader requires
`repositoryClass`); a class declares the supports every member equips and
the checks every member order's compiled `requiredEvidence` includes; each
registered repository has one profile document (purpose and the standards
to emulate, commands, local application startup, branch and pull-request
policy, demonstrated architecture, and a pinned upstream-references list of
`owner/repo@tag path#anchor` entries with one line each on why the section
matters) treated as repo-native authority and loaded on demand by the role
skill for the active order, never at cold start; policy layers launchpad →
class → repository, the more specific layer adding to and narrowing the
wider one, and a profile's conventions prevailing over its class's where it
states them.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Every registered repository must declare `repositoryClass`, a validated
  opaque name; no section declares a class's supports or checks, nothing
  reads the field, and the configuration's sections are a closed list.
- The generated executor skill names a repository only in its refusals
  paragraph; its `Read:` directives name the work order, its citations and
  its subject files.
- The compiled `WorkOrder` carries `requiredEvidence` and no required-checks
  field; a registered profile is applied by a host adapter that unions its
  `requiredEvidence` into the envelope and only narrows.
- The checked context measure is cold-start bytes per role, the installed
  `CLAUDE.md` plus the role skill: the executor's is 6,220 + 20,066 =
  26,286 bytes against a ceiling of 29,246, and the reviewer's has 405
  bytes of headroom. Any sentence added to a role skill raises it; the
  executor re-measures at its base.
- `docs/repositories/` does not exist and has no root key; the
  configuration-root suite refuses a quoted `docs/` path in any script but
  `scripts/lib/config.mjs`.
- WO-119's discovery accepts a declared profile's `dotln-discovery` JSON
  block, and WO-119-D001 reopens when this order defines the profile schema.

**Design (scope discipline):**

- Class checks join each member order's compiled `requiredEvidence`
  through the host adapter that applies a registered profile today
  (`scripts/lib/authority-grants.mjs`); class supports equip through the
  loadout composition under the floor.
- Layers compose under the monotone floor: a class adds checks and supports
  to the launchpad's, and a repository adds its own and narrows. A layer
  that would remove a wider layer's check or widen its authority refuses,
  naming the layer, unless the exact registered-repository grant admits the
  widening (07 §Where the control plane finds its documents).
- Role skills are generated per role, not per order. The role procedure
  gains one sentence: for a target order, read the profile for its
  `Repository:` id on demand. It adds no `Read:` directive, and each skill
  that carries it grows by that sentence.
- The class declaration's home and the profile root are the executor's to
  choose and record: a configuration section changes the closed section
  list, and a document root needs a root key in `scripts/lib/config.mjs`
  (`repositories` already names the registration section); product 07
  states both lists.
- A profile path that is absent, not a contained regular file, or
  unreadable refuses activation of an order against the repository, naming
  the path; activation judges no profile content.
- A profile is authored by a read-only observation order for an
  established repository or by the order that establishes a new one, in the
  launchpad that registers it. The convention keeps a place for WO-119's
  `dotln-discovery` block or records the change; the executor records
  whether WO-119-D001 reopens, and WO-071-D001 reopens if a versioned class
  reference is needed rather than an opaque name.
- A registration may declare `automationLogins`, accounts the forge
  types as users that are treated as automation beside its bot type, and
  `linkHosts`, hosts a bot's comment may link to beside the repository's
  own. Both default to empty, which is today's behavior. The observer
  reads them through the target request: an item by a declared login is
  classed as automated review and goes to triage like a bot's, and a
  bot comment that links only to the repository's host or a declared one
  is stored instead of refused. Nothing else in the screen changes, and
  a declaration never makes an item trusted: triage and verification
  judge it as before.
- Register row FUP-0070 (the map's sibling workflow pilot) is allocated to
  the WO-069 to WO-083 run, this order among its targets; it adds nothing
  to this order's scope.
- **Declined alternatives, recorded:** loading profiles at cold start (the
  biography grows); classes as free-text tags; a repository rule that
  removes a class check (a widening the floor refuses; reopen when a grant
  kind for relaxing evidence exists); compiling class checks in the
  verification contract (a judged source; reopen if the host adapter cannot
  carry them).

**Deliverables:** the class semantics, the profile convention, the skill
change, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture with two repositories in one class: the class's declared
   checks appear in every member order's compiled `requiredEvidence` and
   the class's supports equip in each compiled WorkOrder; a
   repository-level rule adds a check and narrows where declared; one that
   removes a class check, or widens without the exact grant, refuses naming
   the layer.
2. The executor's role skill states the on-demand profile read for a
   target order. Each role skill that gains the sentence grows by that one
   sentence, measured before and after as cold-start bytes per role
   (`npm run meta`); a role that would breach its ceiling in
   `docs/control/budgets.json` follows product 07 §Discipline's cold-start
   route in the same change.
3. A registered repository whose profile is absent, not a contained regular
   file, or unreadable refuses activation of an order against it, naming
   the path; an order against a repository whose profile reads activates.
   The criterion is judged against the declared set; a case outside it is
   a follow-up, not a failure.
4. Observer fixtures: an item by a declared machine login is stored as
   automated review and one by an undeclared user account as human
   review; a bot comment linking a declared host is stored and one
   linking an undeclared host is refused; with neither key declared every
   existing observer and loop fixture passes unchanged; an unknown
   registration key still refuses.
5. Write-backs land, each in place with no dated paragraph: 03 §Agent
   enablement skills (the on-demand profile); 07 §Where the control plane
   finds its documents (the class, its home, the profile root and the two
   registration keys). The 2026-10-02 pass set both documents' ceilings
   to cover these write-backs; a ceiling is raised only by a
   planning-document decision. The profile root's README (the
   convention); the decisions file, with WO-119-D001's disposition; the
   publication locks refreshed.
6. The re-mints the Cost line names are recorded and the regenerated bundle
   is committed; `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the cold-start measurement
before and after; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because
`packages/skeleton/src/loadouts/contributor.ts` is a declared source of
harness-fixtures, and again at final review. No live row.

**Write-back duty:** as listed in criterion 5.

**Known issues and carry-ins:**

- On the three real pull requests WO-065's review read, 12 of 21 bot
  review items were stored as refusals, and a bot that runs as a user
  account is never dispatched; WO-066's loop stops a whole run on one
  refused item (WO-065 D015). Criterion 4 is the decision that row asked
  for. A live run before this order lands stops there, as built.
- WO-184 gives the observer a fixed refusal for a response value it
  cannot use and a containment for text it cannot screen; this order
  edits the same file after it.
- The screen still admits C1 control characters and bidirectional
  overrides (WO-065 D014); no declaration here changes that.

**Non-goals:** authoring any target application's profile (the fork's
planning pass does); the export (WO-074); workstreams (WO-080); a class
check compiled into the verification or feedback contract; relaxing a
class rule from a repository layer.

**Operator-review assumptions**

1. On-demand loading bounds the cold-start growth to one sentence per role;
   the reviewer checks the measurement.
2. Layering follows the monotone floor: a repository can add to and narrow
   its class, never relax it. A repository that must relax a class rule
   needs a grant kind this order does not add.
3. A registration's declared machine logins and link hosts change how an
   item is classed and whether it is stored, never how far it is trusted;
   both are empty unless the operator of the launchpad declares them.
