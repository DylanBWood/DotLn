# WO-073 — Repository class and profile documents: a class is a link group of supports and checks every member equips, a profile document per registered repository is loaded on demand by the role skill, and policy layers launchpad → class → repository (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Configuration semantics and a generated
skill change; no runtime package change beyond the skill render. Assigned
at activation under the standing opt-out default.
**Nomination provenance:** WO-033 phase 2 (class and profile), cut into a
bounded child at the operator's 2026-09-08 correction; the founding notes'
scope layering. Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition.
**Depends on:** WO-071 merged (the registration the class and profile attach
to).
**Recommended placement:** after WO-071; it edits `scripts/lib/config.mjs`,
the harness lowering's skill render for the active order, and
`docs/repositories/`. Target-application profiles (the operator's Angular
repository among them) are authored in the fork that owns them, never here.
A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-071",
    "relation": "hard",
    "reason": "the registration the class and profile attach to"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 2 (class, profile, layering); 01-principles.md Principle 17
(repo-native authority); 03-architecture.md §Agent enablement skills (the
preload compiled from the WorkOrder, role, loadout and envelope);
`packages/compiler/src/harness.ts` (the role skill text).

**Objective:** A registered repository may name a class; a class declares
the supports every member equips and the checks every member order's
required checks include; each registered repository has one profile
document (`docs/repositories/<id>.md`: purpose and the standards to emulate,
commands, local application startup, branch and pull-request policy,
demonstrated architecture, and a pinned upstream-references list with one
line each on why the section matters) treated as repo-native authority and loaded on demand by the role skill for the active
order, never at cold start; policy layers launchpad → class → repository
with the more specific layer winning where it is established.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Rules on one repository did not carry to the next in the founding
  practice; nothing groups repositories, and the role skill knows no
  repository.

**Design (scope discipline):**

- Class checks merge into the compiled WorkOrder's required checks; class
  supports equip through the loadout composition under the floor.
- The generated role skill names the profile path for the active order's
  repository and instructs an on-demand read; the cold-start directed-load
  total is unchanged, measured by WO-039's method.
- **Declined alternatives, recorded:** loading profiles at cold start (the
  biography grows); classes as free-text tags.

**Deliverables:** the class semantics, the profile convention, the skill
change, fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture with two repositories in one class: the class's declared checks
   appear in every member order's required checks and the class's supports
   equip in each compiled WorkOrder; a repository-level rule overrides the
   class where declared.
2. The generated role skill for a target order names the profile path and
   the directed-load total per role is unchanged from the activation base.
3. A missing profile for a registered repository refuses activation of an
   order against it, naming the path.
4. Write-backs land: 03 §Agent enablement skills (the on-demand profile),
   `docs/repositories/README.md` (the convention), 07 (one sentence), ledger
   entry.
5. `npm test` green; `git diff --check` clean; no new dependency; the
   regenerated bundle pins if the skill render changed.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** authoring any target application's profile (the fork's
planning pass does); the export (WO-074); workstreams (WO-080).

**Operator-review assumptions**

1. On-demand loading keeps the cold start flat; the reviewer checks the
   measurement.
