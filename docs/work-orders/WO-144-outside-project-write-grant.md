# WO-144 — Outside-project writes need a grant: a role or support declares the outside roots it may write, the generated hooks refuse a known write destination outside the project that no equipped grant covers, and a mistaken path can no longer create or delete a file in the operator's folders (v0.33.0)

**Model:** any. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The compiled contributor loadout gains
declared outside-write roots per role and support, the generated hook
configuration carries them, and a fifth refusal joins the four at the
observed pre-tool boundary. No kernel change. Assigned at activation under
the standing opt-out default.
**Cost:** adds one refusal to the existing pre-tool guard, evaluated only
for a write tool or a shell command whose write targets the existing
extractor names (`shellWriteTargets`, WO-135); no new hook, gate, key,
receipt or classifier. Adds role text: one sentence naming the refusal and
the grant, counted against the cold-start ceilings (executor 20,849 of
24,576 bytes on 2026-09-19); the executor reports the new totals. Removes
the recorded incident class: a verifier's stray stderr redirect created a
file in the directory above its worktree (2026-09-18, WO-054 VER-003), and
today nothing refuses the same mistake aimed at the operator's documents.
Removes the operator's reliance on the native sandbox for this case, which
the operator has relaxed for throughput and which product 03 records as not
confining a sibling write on either harness (C-W6, X-W6). Wall-clock,
tokens and context bytes of the order itself are unknown until run.
**Nomination provenance:** operator ideation of 2026-09-18 during WO-054
verification (ledger section "Out-of-project file effects as an explicit
grant"; product 03 §Candidate — DotLn-owned authority with minimal native
harness restrictions), set by the operator for priority at the next
planning pass; the operator's 2026-09-19 answers in this pass, captured
verbatim in ignored intake: the grant belongs to specific roles or supports;
work-stream-facing roles of the enterprise starter will by nature write
outside a project; temporary and scratch directories may be common across
modes; a save into the operator's project, document or desktop folders is
not allowed without specific authorization or direction; and the sandbox is
relaxed for throughput while roles and supports are built to make dangerous
activity deterministically impossible. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-135 merged (the known-destination extractor and the
planning-branch refusal this order sits beside; closed); WO-042 merged
(authority provenance and monotone envelopes; closed).
**Recommended placement:** directly after the cleanup pair, lane pair with
WO-143, whose surfaces (the worker and resident stores) this order does not
touch. It edits `packages/skeleton/src/harness-host.ts` (the pre-tool
guards), `packages/skeleton/src/loadouts/contributor.ts`,
`packages/compiler/src/harness.ts` (the generated configuration and role
text) and the regenerated bundle, after WO-142 (which edits the advisory
key and the live-gate read list in the same host). A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-135",
    "relation": "satisfied-by-close",
    "reason": "the known-destination extractor and the refusal it sits beside"
  },
  {
    "workOrderId": "WO-042",
    "relation": "satisfied-by-close",
    "reason": "authority provenance: a grant is declared, compiled and attributable"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Candidate — DotLn-owned
authority with minimal native harness restrictions (the 2026-09-18
direction and its open questions); `docs/evidence/WO-054/ideation-2026-09-18.md`;
`packages/skeleton/src/harness-host.ts` (`planningWriteRefusal`, which
resolves a known destination to a physical path and today skips every path
outside the repository); `packages/skeleton/src/harness-command.ts`
(`shellWriteTargets`); `packages/skeleton/src/loadouts/contributor.ts` (the
six roles and their supports); 07-execution-guide.md §Discipline (machinery
stand-down: the kept refusals and what stays advisory);
`docs/AI-HARNESS-SECURITY.md` (the hook boundary);
[the planning document](../planning/outstanding-cleanup-2026-09-19.md) §10.

**Objective:** In a Claude session under the generated hooks, a write tool
call or a shell command whose write destination is known and resolves
outside the project is admitted only when an equipped role or support
grants a root that contains it, and is otherwise refused before it runs,
with a message that names the destination, the missing grant and the
operator's recovery control. The guarantee is stated at its real width: it
covers known destinations; a program whose effects the extractor cannot
name remains under host permissions, and the documents say so.

**Observed gap (dated 2026-09-19, `main` at `3b3533f8`):**

- `planningWriteRefusal` resolves each known destination and continues past
  any path outside the repository; no other guard looks at it. On every
  branch an outside write is admitted.
- The recorded incident: a verifier's shell command carried an unintended
  stderr redirect whose destination resolved to the directory above the
  worktree and created a file there; the session removed it.
- Legitimate outside writes exist: this planning pass wrote its scratch
  files and the refuter's prompt under the session scratch directory and the
  system temporary root, and a planner in a worktree writes main's ignored
  intake. Which other outside destinations sessions use is unknown until the
  ignored hook journals are read (criterion 1).
- Codex fires no project hook in the recorded profile; there the rule is
  role text only.

**Design (scope discipline):**

- **Grants are data on roles and supports.** A role or support declares
  outside-write roots from a closed set of kinds: the system temporary
  root, the session scratch directory, the main checkout's ignored intake,
  and an operator-named absolute root recorded with its source. Equipping
  the role or support is what grants; nothing is granted ambiently. The
  compiler lowers the union into the generated hook configuration and the
  manifest shows it.
- **Defaults come from observation, not guesswork.** The executor first
  runs the existing extractor over the retained hook journals and lists
  every outside destination sessions actually wrote, by role. Temporary and
  scratch roots are expected to be common to every role; anything under the
  operator's home outside those roots is granted to no role by default.
- **Refusal at the existing boundary.** The guard reuses the planning
  refusal's physical-path resolution, including symlinks and removals. An
  unknown or opaque destination is not refused by this order; it stays
  under host permissions and is journaled as unobserved.
- **Recovery and direction.** `operator override:` admits, as for every
  refusal. A work order that must write outside (the starter export, a
  target worktree) names its roots; carrying those from an order's contract
  into the active grant is the next step and is not built here (non-goal),
  so until then such an order's role carries an operator-named root.
- **Fail-conservative in one direction only.** A destination the guard can
  resolve and no grant covers refuses; a failure inside the guard itself
  degrades to the present behavior with one advisory, never to a session
  that cannot write its own project.
- **Declined alternatives, recorded:** a shell classifier for opaque
  commands (declined by the stand-down; unchanged); relying on the native
  sandbox (relaxed by the operator, and recorded as not confining a sibling
  write); an allowlist in a personal settings file (a private setting is
  not a source of a guarantee); asking instead of refusing (the operator's
  answer is refusal without authorization or direction).

**Deliverables:** the grant declaration and its lowering; the guard; the
journal inventory; regenerated bundle and manifest; the fixtures and
write-backs below.

**Acceptance criteria (all required)**

1. The decisions file records the inventory: every outside destination the
   extractor finds in the retained journals, counted by role and root kind,
   and the default grants chosen from it, with any destination left
   ungranted named.
2. Fixture, generated hooks: with default grants, a write tool call and a
   shell redirect into the scratch and temporary roots are admitted; the
   same two forms aimed at a sibling of the project, at the parent
   directory (the recorded incident's shape) and at a documents-like folder
   under a fixture home are refused before execution, each naming the
   destination and the missing grant; a symlink inside a granted root that
   points outside it is refused; a removal is judged like a write.
3. Fixture: equipping a support that grants an operator-named root admits a
   write under it and nothing beside it; unequipping it refuses again; the
   manifest lists the effective roots and their sources.
4. Fixture: a guard failure (unreadable configuration) admits with one
   advisory and journals the cause; the four existing refusals are
   unchanged; an in-project write is never judged by this guard.
5. The documents state the width: product 03 (the candidate gains a dated
   note: grant shape and declaration settled, enforcement for known
   destinations shipped, opaque effects and Codex open), product 07
   §Discipline and `docs/AI-HARNESS-SECURITY.md` (five refusals, what each
   covers and does not), CLAUDE.md through the generator, the map's catalog
   rows for the orders that will need an order-named root.
6. `harness check` passes on the regenerated bundle; `npm test` green;
   `git diff --check` clean; no new dependency; cold-start totals per role
   recorded, and any ceiling met is handled by the one route product 07
   names.

**Evidence gate:** the fixture transcripts; the inventory; `npm test` once
at final review. A refusal of a legitimate write in a real session, or an
outside write the journal shows admitted without a grant, is the reopening
observation.

**Write-back duty:** sources and reopening conditions in the order's
decisions file; the ledger is reserved for operator ideation and planning
synthesis. Record corrections the same day as what was misread, meant and
changed.

**Non-goals:** opaque command effects; Codex enforcement; reads outside the
project; network effects; carrying outside roots from a work order's
contract into the active grant; the enterprise starter's work-stream roles,
which declare their own grants when they are written; any change to the
native sandbox or to personal settings.

**Operator-review assumptions**

1. Temporary and scratch roots are granted to all six contributor roles by
   default, if the inventory agrees.
2. Nothing under the operator's home outside those roots is granted by
   default; main's ignored intake is granted to the roles the inventory
   shows writing it.
3. Refusal, with `operator override:` as the recovery, is the right default
   for an ungranted known destination.
4. Stating the guarantee at the width of known destinations is acceptable
   for a first slice; opaque effects are the next order's subject.
