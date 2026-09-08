# WO-074 — Launchpad export kit: `launchpad export <dir>` materializes a launchpad instance from a manifest-listed kit of scripts, suites, contracts, templates and license files, with no intake, local state, package source or evidence inside (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new control-plane command and the kit
manifest; no runtime package change. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** WO-033 phase 3 (the kit half, without the build)
and its "license files at export" item, cut into a bounded child at the
operator's 2026-09-08 correction. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: the pre-drafted first order's
audit questions stay generic; the reviewer reads the exported text for any
description of a specific managed host, gateway or policy.
**Depends on:** WO-069 merged (the configuration example and roots the kit
carries); WO-070 merged (Beacon emission without the skeleton package);
WO-038 merged (license metadata and the default license files; satisfied at
`v0.13.2`).
**Recommended placement:** after WO-069 and WO-070, under the dated planning
deferral; it adds `scripts/launchpad.mjs` and the kit manifest generator. A
recommendation, not a dependency token.

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 3 and §License files at export (the umbrella's wording);
03-architecture.md §Platform and instance boundary (the fork is of the
starter); `docs/LEGAL.md` §Decision (the distribution posture);
`docs/publication/` (the implementation-overlay template); WO-001's shape
and `docs/discovery/` (the constrained-environment audit questions
preserved in the ledger).

**Objective:** `npm run launchpad -- export <dir>` writes into an empty
directory: the control-plane scripts and suites as a pinned copy, a
`package.json` with the same script names and exactly pinned dev
dependencies, the document roots with README conventions, a minimal
operating contract (`CLAUDE.md` with `AGENTS.md` symlinked; generated marked
block; hand-written floor with only the clean-room and secret rules and the
resume phrases), the repository-profile and workstream templates, the
executor half of the guide and the operator playbook, a sanitized
harness-security template, a client-facing README, the implementation-overlay
template with an upstream pointer list, a pre-drafted first work order in
WO-001's shape extended with the harness smoke, the local-terms registration
step and the audit questions, a `.gitignore`, `LICENSE`, `LICENSE-docs` and
`NOTICE` (or `LICENSE-PENDING.md` under `--license none`), `UPSTREAM.md` and
`KIT-MANIFEST.json` naming the commit, tag and per-file hashes; effort
attestation refuses a harness version bounded discovery has not recorded.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Nothing produces a starter; the operator's starter repository is empty.

**Design (scope discipline):**

- Kit files only in the manifest; instance files never (the configuration,
  control, orders, evidence, verification, final-review, workstream and
  refutation roots, the product overlay, the build overlay).
- The export never includes intake, `.claude/settings.local.json`, Beacons,
  runtime stores, package source or this repository's evidence.
- **Declined alternatives, recorded:** a Git subtree or submodule of core;
  publishing packages.

**Deliverables:** the command, the manifest, the templates, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. `launchpad export <dir>` refuses a non-empty destination; the exported
   scripts are byte-identical to the source commit named in `UPSTREAM.md`
   and the manifest hashes verify; the exported suites pass in place with an
   offline `npm ci` against the exported lockfile.
2. A lifecycle transition inside the export emits a control Beacon without
   any `packages/skeleton` source present.
3. A negative fixture proves the export contains no intake, local settings,
   Beacon output, runtime store, package source, evidence from this
   repository's orders, or any term list, hashed or plain; the local-terms
   check runs over every exported kit text with the operator's list present
   and reports it.
4. `LICENSE`, `LICENSE-docs` and `NOTICE` are byte-identical to core's and
   manifest-listed; `LICENSE-PENDING.md` appears only under `--license none`;
   no license text is invented.
5. Effort attestation in the export refuses a harness version its discovery
   record lacks, so a fresh fork's orders declare `any`, and the client
   README says so.
6. Write-backs land: 03 §Platform and instance boundary (the kit's first
   slice), `docs/LEGAL.md` (a dated observation), `docs/README.md`, ledger
   entry; publication index rows and locks.
7. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** the runtime build and harness bundle in the export (WO-075);
the overlay (WO-076); update (WO-077); the registry (WO-078); publishing
packages.

**Operator-review assumptions**

1. The reviewer reads the exported text for any specific host, gateway or
   policy description; generic questions are permitted, descriptions are
   not.
