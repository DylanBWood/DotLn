# WO-148 — Bind a resident to the active order: one command turns the canonical active order and its worktree into a resident store whose mission check watches that work, refuses a stale binding by name, and prints the launch and presence lines, so watching an order no longer means hand-writing a store (v0.40.0)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One new control-plane command with a
binding record, writing a store in the shape `decodeResidentConfiguration`
already accepts with the `mission-check` actor WO-099's fixtures already
declare. No kernel, resident-host, event, schema or hook change. Assigned
at activation under the standing opt-out default.
**Cost:** adds one command and, per bound order, one ignored store
directory under the launchpad's local control lane and a binding record of
a few hundred bytes; no gate, hook, key, receipt or recurring check.
Removes the hand-written store: today watching a real order means writing
the compiled graph, its environment, one actor per phase and a
`MissionSource` whose base commit and surfaces are copied out of the order
by hand, which is why WO-099's own live row built a synthetic worktree and
a purpose-built store to be observed at all
(`scripts/evidence-mission-check.mjs`), and why a store left pointing at a
finished order keeps judging a worktree nobody works in. Wall-clock,
tokens and context bytes of the order itself are unknown until run.
**Nomination provenance:** the operator's observation of 2026-09-20 during
WO-099, recorded as the planning candidate
[Binding a resident to the active work](../planning/resident-binding-to-active-work-2026-09-20.md)
(`FUP-6c22a74a648a3b56`); the six decisions that candidate asks for are
answered in the design below and in the 2026-09-21 planning document.
Planner-synthesized in the 2026-09-21 standard pass; the dispatch is
captured verbatim in ignored intake (SHA-256 in the ledger section).
Opaque identifier, not a priority. Clean-room screen: no stop condition;
the binding record carries physical paths and lives only in the ignored
lane.
**Depends on:** WO-099 merged (the mission check, `MissionSource` and the
Contributor build's mission-only presence policy; closed, v0.37.0);
WO-069 merged (the configuration root that names the control lane;
closed, v0.37.2).
**Recommended placement:** lane pair with WO-147, directly after the
WO-138 and WO-071 pair; it adds `scripts/resident-bind.mjs` and its tests,
and edits the skeleton README's resident runbook and product 03; WO-147
edits the worker store and the resident fixtures and none of these. It
precedes WO-100 and WO-111 so the resident the operator runs daily is the
one those orders extend. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-099",
    "relation": "satisfied-by-close",
    "reason": "the mission check, its MissionSource and the mission-only presence policy"
  },
  {
    "workOrderId": "WO-069",
    "relation": "satisfied-by-close",
    "reason": "the configured control lane the store is written under"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** the candidate document above (§What is
observed, §What a candidate must decide); 03-architecture.md
§Operator-presence policy (the `DOTLN_RESIDENT_STORE` binding, the mission
check paragraphs and the capsule bounds); `packages/skeleton/src/mission-check-protocol.ts`
(`MissionSource`, `assertMissionSource`);
`packages/skeleton/test/mission-check.fixture.ts` (`missionPinFromSource`,
`observeMissionSubject`, `buildMissionCheckRequest`, the `mission-check`
actor and the mission-only phase list); `scripts/evidence-mission-check.mjs`
(the live row's construction); `packages/skeleton/src/loadouts/contributor.ts`
(`CONTRIBUTOR_MISSION_POLICY`, `CONTRIBUTOR_MISSION_PHASE`,
`CONTRIBUTOR_MISSION_SURFACE`); `packages/skeleton/README.md` §Resident host
(the store shape; configuration immutable within a store);
`scripts/worktree.mjs` (`start` creates the worktree and activates the
order in it); `scripts/lib/control.mjs` (canonical status);
`docs/evidence/WO-099/decisions.md` §WO-099-D013 and §WO-099-D016;
`docs/work-orders/WO-124-impact-surfaces-derivation.md` (surface derivation
is that order's).

**Objective:** `node scripts/resident-bind.mjs WO-NNN --surface <path>...
--transport <claude-cli-print|codex-cli-exec> --model <model> --effort <level>`
reads the canonical control state for the order (its phase and authority
path), the worktree the helper created for it (the branch named by the
order, located through `git worktree list`), the base commit (the merge
base of that branch with the `main` it was created from, overridable with
`--base`), the order's authority file as the contract path, its decisions
file when one exists, exactly the surfaces supplied on the command line,
and the vision path and thesis headings the Contributor build's mission
policy uses, and writes a fresh store
`<control lane>/local/resident/WO-NNN-<n>/` whose `resident.json` is the
Contributor build's graph and environment with the mission-only presence
policy and one `mission-check` actor carrying that `MissionSource` and the
named transport, beside a `binding.json` that records the order, worktree,
base, surfaces, contract hash and the canonical revision read. It prints
the resident launch line (`--once` and `--tick`), the presence and status
lines, and the `export DOTLN_RESIDENT_STORE=<store>` line for stage
sessions. `--check <store>` compares a binding with canonical state and
names every mismatch. The command refuses, naming the cause, for an unknown
or closed order, a missing worktree, no surface, or a launch line requested
for a stale binding; a rebind writes a new store and leaves the old one
byte-identical.

**Observed gap (dated 2026-09-21, `main` at `502d85f9`):**

- Nothing starts or configures a resident: `scripts/worktree.mjs start`
  creates the worktree, activates the order and bootstraps; `scripts/resume.mjs`
  and `scripts/bootstrap.mjs` contain no resident logic (the candidate's
  observation, re-checked by search).
- A store's configuration is immutable within that store
  (`decodeResidentConfiguration`; the skeleton README says a changed policy
  or actor needs a fresh store with the old one retained).
- Every `MissionSource` in the repository is hand-written: the fixture's
  (`packages/fixture`, `WO-999`, five decisions, one thesis heading) and the
  live row's synthetic one. No path reads an order's worktree, base or
  contract into one.
- Presence from a working session is opt-in through `DOTLN_RESIDENT_STORE`
  and nothing binds it (product 03 §Operator-presence policy).

**Design (scope discipline):**

- Who owns the binding: an explicit operator command reading canonical
  state, not generation at activation. Activation runs inside
  `worktree start` before the worktree is bootstrapped; a bind that fails
  there would fail activation, and the transport, model and effort are the
  operator's choice at launch (WO-122's rule that a CLI worker's launch is
  an observed row). The worktree helper may print the bind hint in its
  "Next" block; nothing requires it.
- Store lifetime: a store follows one binding of one order. Rebinding after
  a phase change, a base change or a moved worktree writes a new store and
  retains the old one, which is the immutability rule kept rather than
  worked around. Prune eligibility for retained bound stores is not decided
  here.
- Declared surfaces come from the command line and are recorded in the
  binding; none is derived. The out-of-surface rule is only as good as the
  declaration, and deriving it is WO-124's contract, not a convenience.
- Concurrency: one store per bound order; the per-store lock already lets
  several residents coexist; the mission-only policy has no discretionary
  work phase, so nothing competes for absence work. Whether absence work
  serializes across in-flight orders is WO-100 and WO-111's question.
- Session presence: the command prints the export line and the operator's
  stage session exports it; the generated hooks then record heartbeats as
  actor liveness, and only explicit `away` and `back` are human (WO-121).
  Not automatic: product 03 keeps missing bindings inert.
- Staleness: `--check` compares the binding's order phase, worktree, base
  and contract hash with canonical state; a launch line is refused for a
  stale binding with the mismatch named. A resident already running keeps
  judging its declared subject, which is the recorded limit; refusing
  inside the resident is a resident-host change this order does not make.
- **Declined alternatives, recorded:** generating the store at activation
  (above); deriving surfaces from the order's prose or the map's catalog
  column (a contract change); an installed daemon or scheduler (WO-068's
  standing non-goal); editing `resident-host.ts` to refuse a stale subject
  (a runtime change with replay consequences; reopen with WO-111's
  evidence).

**Deliverables:** the command and its tests over a real-Git launchpad and
worktree fixture; the binding record; the write-backs in criterion 5.

**Acceptance criteria (all required)**

1. Fixture: from a fixture launchpad with an activated order in a
   worktree, `bind` writes a store that `decodeResidentConfiguration`
   accepts and `dotln status --store` reads, whose `mission-check` actor's
   `MissionSource` names that worktree root, the order's authority path as
   contract, the decisions path when present, the merge-base commit,
   exactly the supplied surfaces and the vision path; `missionPinFromSource`
   over it equals a pin built by hand from the same inputs; the printed
   lines name that store.
2. Refusals: an unknown order, a closed order, a missing worktree and a
   bind with no surface each refuse naming the missing thing; `--check`
   against a store whose order closed, whose worktree moved, or whose
   contract bytes changed reports each mismatch and exits non-zero, and a
   launch line is refused for it; a rebind writes a new store and the old
   store's bytes are unchanged.
3. No physical path enters a committed surface: the binding record and the
   store live in the ignored lane, and the evidence row redacts paths as
   WO-099's live row does.
4. Live row (operator-run, outside `npm test`): the operator binds one real
   in-flight order, runs the resident `--once` from an outside terminal
   with the operator marked away, and the row records the launch, the
   capsule's paths as counted against the bound worktree, the verdict and
   the label `observed` or `blocked`; a verdict other than `on-mission`
   does not fail this order, since the row proves aim, not the work.
5. Write-backs land: product 03 §Operator-presence policy (how a store is
   bound and what stays declared); the skeleton README's resident runbook
   names the command as the ordinary path and keeps the hand-written shape
   as the reference; the candidate document records its disposition; the
   decisions file.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts and the live row; `npm test`
once at final review.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for planning synthesis.

**Non-goals:** deriving surfaces (WO-124); deriving what to do during
absence (WO-100); the unattended hour (WO-111); an installed daemon;
automatic rebinding on a phase change; any `resident-host.ts` change;
prune eligibility of bound stores (reopen with WO-142 D022's prune
follow-up); the selection policy on `MissionSource` that WO-099 D016 names
as a separate product decision, which a bound real worktree is the first
place to observe.

**Operator-review assumptions**

1. The store lives under the launchpad's ignored control lane rather than
   a `.runtime/` directory in the worktree.
2. Surfaces are typed by the operator at bind time until WO-124 derives
   them; the bind refuses without at least one.
3. The base commit is the merge base with `main`; `--base` exists for the
   integrated-sibling case (WO-079) where the operator knows better.
