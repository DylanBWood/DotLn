# WO-075 — Kit runtime and harness bundle in the export: the launchpad export carries a pinned, byte-identical runtime build and the Contributor build's compiled bundle whose hooks import that runtime, verified by `harness check` inside the export (version assigned at activation)

**Model:** any capable model; the recorded smoke needs the actual harness,
run by the operator outside the sandbox. State the model and effort actually
run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The export gains the build; no runtime
package capability change. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-033 phase 3 (the build half: "the export
carries the build"), cut into a bounded child at the operator's 2026-09-08
correction. Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-074 merged (the kit the runtime and bundle are placed
in); WO-049 merged (the import-root mechanism the exported hooks reuse);
WO-042 merged (grants with provenance in the exported bundle).
**Recommended placement:** after WO-074; it edits `scripts/launchpad.mjs`
and the harness emitter's import-root handling. A recommendation, not a
dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 3 (the runtime build and the bundle); 02-domain-model.md §Harness
compiler v1; 03-architecture.md §Agent enablement skills; `docs/LEGAL.md`
§Decision (the runtime build travels under the decided terms);
`docs/work-orders/WO-049-target-worktree-bundle.md` (`importRoot`);
`docs/evidence/WO-039/README.md` (the directed-load method, criterion 6).

**Objective:** The export carries `kit/runtime/`, the unminified compiled
output of the compiler and the skeleton modules the hooks and the `harness`
command import, byte-identical to core's build at the named commit and
manifest-listed with no npm publication; the Contributor build's compiled
bundle for the launchpad profile (settings, hooks, role skills, the marked
block) with hooks importing the kit runtime through a kit-relative root;
`harness check` wired into the export's `npm test`; and a recorded smoke in
which a session opened in the export is refused a denied effect by a
generated hook and resolves a role skill by resume phrase.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- A fork of a kit without a build runs on prose; the redirect requires that
  a fork's sessions run on a compiled actor from the first commit.

**Design (scope discipline):**

- The build is copied from `packages/*/dist` at the named commit and
  hashed; a fixture rebuilds and compares.
- The bundle is emitted by WO-049's mechanism with `importRoot` set to the
  kit-relative runtime, so the exported hooks carry no absolute path.
- The directed-load total per role is measured inside the export by WO-039's
  method and reported beside core's.
- **Declined alternatives, recorded:** publishing packages; minified output
  (reviewable compiled output is the point).

**Deliverables:** the runtime copy and manifest entries, the exported
bundle, the `npm test` wiring, the smoke record, the write-backs below.

**Acceptance criteria (all required)**

1. The exported runtime is byte-identical to core's build at the named
   commit (rebuild and `cmp`), manifest-listed, and contains no package
   source.
2. `harness check` passes inside the export and refuses a one-byte drift;
   the exported hooks contain no absolute path.
3. The recorded smoke shows a session in the export refused a denied effect
   by a generated hook and resolving a role skill by resume phrase, with
   identifiers reduced to shapes.
4. The directed-load total per role inside the export is reported and not
   larger than core's for the same role at the export's commit.
5. Write-backs land: 03 §Platform and instance boundary (the build travels
   with the kit), `docs/LEGAL.md` (a dated observation), ledger entry; a
   dated capability-table row for `launchpad.starter`.
6. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; the smoke record; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the overlay (WO-076); update (WO-077); package publication.

**Operator-review assumptions**

1. Compiled output under the decided license is reviewable distribution;
   package source stays out.
