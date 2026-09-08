# WO-070 — Beacon portability: the control plane emits control Beacons without the skeleton package, with one module identity for the build-free leaves and no file imported from both source and `dist/` (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A module-identity refactor; every Beacon
fixture byte-identical. Assigned at activation under the standing opt-out
default.
**Nomination provenance:** WO-033's "Beacon portability" design item, cut
into a bounded child at the operator's 2026-09-08 correction. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen: no
stop condition.
**Depends on:** WO-021 merged (per-worktree Beacon caches; satisfied at
`v0.8.0`).
**Recommended placement:** beside WO-069 in a free lane, under the same
dated planning deferral; it edits the seven build-free `.mjs` leaves under
`packages/skeleton/src/`, `scripts/lib/beacons.mjs`,
`scripts/lib/beacon-observe.mjs` and `scripts/resume.mjs`. A recommendation,
not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
(the Beacon portability item and its observed gap); 02-domain-model.md
§Beacon codebook v1 through §Beacon group codebook v1; `packages/skeleton/src/beacon-codebook.mjs`,
`beacon-io.mjs`, `beacon-provenance.mjs`, `beacon-v3-codebook.mjs`,
`beacon-v3-fs.mjs`, `control-beacon-fs.mjs`, `control-codebook.mjs`;
`scripts/lib/beacons.mjs`, `scripts/lib/beacon-observe.mjs`.

**Objective:** Give the seven build-free leaves one home the control plane
owns (a build-free module directory or a `packages/beacons` workspace with
no build step, the executor choosing and recording why) that the skeleton
imports by name, so that no file is imported both from source and from
`dist/` and a lifecycle transition emits a control Beacon with no
`packages/skeleton` source present.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- `scripts/resume.mjs` and `scripts/lib/beacons.mjs` import the seven leaves
  from `packages/skeleton/src/` while `scripts/lib/beacon-observe.mjs`
  imports the same library from `dist/`; an exported launchpad without the
  skeleton package could not emit control Beacons.

**Design (scope discipline):**

- One module identity; the kernel, compiler, reactor and codebook semantics
  unchanged; a grep test proves no dual import.
- **Declined alternatives, recorded:** copying the leaves into `scripts/`
  (two identities); building the skeleton inside the export (the export
  carries compiled output, WO-075).

**Deliverables:** the module move, the import changes, the grep test, the
portability fixture, the write-backs below.

**Acceptance criteria (all required)**

1. Every Beacon fixture (codebook v1 through group v1, the perception and
   provenance suites) passes byte-identically.
2. A grep test proves no `scripts/` file imports the same module from both
   source and `dist/`.
3. A fixture copies `scripts/` and the module directory to a temporary root
   with no `packages/skeleton/src` present and a lifecycle transition there
   emits a control Beacon that decodes.
4. Write-backs land: 03 §Layer diagram (the module's place), skeleton README,
   ledger entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** Beacon semantics; the export itself (WO-074).

**Operator-review assumptions**

1. Either home is acceptable if it yields one identity; the executor's
   recorded reason is reviewed.
