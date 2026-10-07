# WO-074 — Launchpad export kit: `launchpad export <dir>` materializes a launchpad instance from a manifest-listed kit of scripts, suites, contracts, templates and license files, with no intake, local state, package source or evidence inside (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. A new control-plane command and the kit
manifest; no runtime package change. Assigned at activation under the
standing opt-out default.
**Cost:** adds `scripts/launchpad.mjs` with `export`, the kit manifest
generator, the kit templates (the minimal operating contract, a
configuration example, the client README, a sanitized harness-security
template, the pre-drafted first work order, the repository-profile and
workstream templates, a `.gitignore`), one `launchpad` entry in
`package.json`, fixtures with their suite row in `scripts/test-runner.mjs`,
and at most 400 bytes in product 03. Removes nothing that runs today: no
command produces a starter. WO-075, WO-076, WO-077 and WO-078 depend on it.
Re-mints: `package.json` is a common source of the five evidence
inventories (`scripts/lib/evidence-sources.mjs`), so each edition whose
check the new script entry stales is re-minted deterministically, a
feedback edition by carry, since `package.json` is not among the sources
the feedback verifier judges; no live episode. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** WO-033 phase 3 (the kit half, without the build)
and its "license files at export" item, cut into a bounded child at the
operator's 2026-09-08 correction. Planner-synthesized draft. Opaque
identifier, not a priority. Clean-room screen: the pre-drafted first order's
audit questions stay generic; the reviewer reads the exported text for any
description of a specific managed host, gateway or policy. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: criterion 5 follows the advisory attestation the 2026-09-15
stand-down left, the in-place claim is bounded to what a kit without
package source can run, and the map's and the register's carry-ins are
written in
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-069 merged (the configuration schema and roots the kit's
example follows; closed, v0.37.2); WO-070 merged (Beacon emission without
the skeleton package; closed, v0.51.1); WO-038 merged (license metadata and
the default license files; satisfied at `v0.13.2`).
**Recommended placement:** in the serial run after WO-112 and before
WO-075. This order adds `scripts/launchpad.mjs`, the kit manifest generator
and the templates, and edits `package.json`, `scripts/test-runner.mjs`,
product 03, `docs/LEGAL.md` and `docs/README.md`. WO-075, WO-077 and WO-078
edit `scripts/launchpad.mjs` after it, and WO-075 writes the same product 03
section and `docs/LEGAL.md`. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-069",
    "relation": "hard",
    "reason": "the configuration schema and roots the kit's example follows"
  },
  {
    "workOrderId": "WO-070",
    "relation": "hard",
    "reason": "Beacon emission without the skeleton package"
  },
  {
    "workOrderId": "WO-038",
    "relation": "satisfied-by-release",
    "release": "v0.13.2",
    "reason": "license metadata and the default license files"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary (the fork is of the starter; kit and instance files);
`docs/LEGAL.md` §Decision — 2026-09-06 (the distribution posture and the
pinned license hashes) and §Current state;
`docs/publication/implementation-overlay-template.md`;
`docs/work-orders/WO-001-environment-truth.md` (the first order's shape);
`docs/lineage/idea-ledger.md` (the entry "Policy layers by scope carry
across repositories", which records the audit as a fork's first order);
`scripts/resume.mjs` (the attestation advisory); `scripts/test-runner.mjs`
and `scripts/build.mjs` (the build before the suites);
`scripts/test-beacon-portability.mjs` (WO-070's copied control plane);
`scripts/lib/terms.mjs`; `scripts/test-configuration-root.mjs` (the
literal-root refusal); `docs/evidence/WO-069/decisions.md` D001 and D002;
`docs/evidence/WO-070/decisions.md` D009;
`docs/planning/machinery-stand-down-2026-09-15.md` §5; 07-execution-guide.md
§Discipline (outside-project write grants); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history only
(the Design bullets led "Phase 3 — launchpad export carries the build." and
"License files at export.").

**Objective:** `npm run launchpad -- export <dir>` writes into an empty
directory: the control-plane scripts and suites as a pinned copy, the
build-free `packages/beacons` workspace their Beacon emission imports, a
`package.json` with the same script names and exactly pinned dev
dependencies, a configuration example (`dotln.config.example.json`; the
instance's own `dotln.config.json` is instance-owned and never written),
the document roots with README conventions, a minimal operating contract
(`CLAUDE.md` with `AGENTS.md` symlinked; generated marked block;
hand-written floor with only the clean-room and secret rules and the resume
phrases), the repository-profile and workstream templates, the executor
half of the guide and the operator playbook, a sanitized harness-security
template, a client-facing README, the implementation-overlay template with
an upstream pointer list, a pre-drafted first work order in WO-001's shape
extended with the harness smoke, the local-terms registration step and the
audit questions, a `.gitignore`, `LICENSE`, `LICENSE-docs` and `NOTICE` (or
`LICENSE-PENDING.md` under `--license none`), `UPSTREAM.md` and
`KIT-MANIFEST.json` naming the commit, tag and per-file hashes; effort
attestation inside the export records an unmatched harness version as
supplied with core's advisory.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Nothing produces a starter: `scripts/launchpad.mjs` does not exist and
  `package.json` has no `launchpad` script. Whether the operator's starter
  repository still holds nothing is not recorded; the last committed
  observation is dated 2026-09-06, and product 03 §Platform and instance
  boundary calls the siblings operator-reported intentions.
- Effort attestation no longer refuses. Since the 2026-09-15 stand-down
  (commit `16ecf2cc`) `scripts/resume.mjs` records an attested harness,
  version and effort as supplied and prints an advisory when discovery holds
  no matching observation; with no `docs/discovery/environment.json` every
  attestation carries it. The map's row records criterion 5's refusal as
  receipt 017's known issue, and receipt 032 finds it again.
- The control plane loads package code: `scripts/test-runner.mjs` imports
  skeleton source modules at load and builds the TypeScript packages before
  its suites; `scripts/lib/harness.mjs` and
  `scripts/lib/authority-grants.mjs` load compiled output; bootstrap and
  `npm run harness` build first. A kit with no package source cannot start
  core's `npm test`; the executor re-reads these imports at its base.
- WO-070's fixture shows a copied control plane activating an order and
  emitting a decodable control Beacon with `scripts/` and the build-free
  `packages/beacons` workspace and no skeleton source.
- No heading or marker delimits an executor half of product 07 (175,881
  bytes at `bd437eb2` on 2026-10-07; WO-167's fold closed at v0.53.1 and
  left none), and the emitted role skills read four 07 sections that sit
  across any such halves, so the kit copies product 07 whole (Execution
  plan step 4; 2026-10-07 pass).

**Design (scope discipline):**

- Kit files only in the manifest; instance files never (the configuration,
  control, orders, evidence, verification, final-review, workstream and
  refutation roots, the product overlay, the build overlay).
- The export never includes intake, `.claude/settings.local.json`, Beacons,
  runtime stores, package source or this repository's evidence. Package
  source means the TypeScript source of the compiled packages; the
  build-free `packages/beacons` workspace, whose source is its runtime
  (`scripts/build.mjs` makes no copy of it), is a kit file, because
  criterion 2's Beacon needs it (WO-070).
- A kit without package source cannot run core's suites in place (Observed
  gap). This order claims what runs without a build (criterion 1) and
  records the in-place suite run as a follow-up in the decisions file
  (operator-review assumption 2).
- Attestation in the export is core's, since the scripts are byte-identical:
  an unmatched version or effort is recorded as supplied with an advisory.
- The first order's audit questions are four generic topics: gateway and
  provider behavior, metering between foreground and delegated execution,
  interruption recovery, and managed-settings precedence.
- The kit copies product 07 whole, listed in the manifest like every
  other kit file; no section reader is written (the prose-parsing screen of
  the 2026-10-07 pass).
- The local-terms check is `scripts/lib/terms.mjs`'s: with no list it
  reports `unavailable`, which the export prints and never counts as a
  pass; a list present but empty or malformed refuses the export, as does a
  match, which it reports by file and line without the term.
- Every path the command reads under the document roots resolves through
  `scripts/lib/config.mjs`; `scripts/test-configuration-root.mjs` refuses a
  quoted `docs/` path in any other script.
- Carried in from the map's row (WO-144, 2026-09-19): the export writes
  outside the project; a destination outside the roots its role is granted
  needs an operator-named absolute root on the executing role or an equipped
  support, since order contracts do not yet supply grants. The fixtures
  write under the system temporary root, which the default roles' grants
  cover (07 §Discipline), so no criterion needs another root.
- Carried in from register row FUP-0070 (the map's sibling workflow pilot,
  allocated to the WO-069 to WO-083 run): the kit stays usable without a
  documentation adapter or a paid account, and packaging beyond the process
  kit stays open.
- The executor records whether WO-069-D001 (a first consumer of `build` or
  `release` finds the shape insufficient) or WO-069-D002 (a kit needs a
  launchpad neither the ascent nor `DOTLN_LAUNCHPAD` names) reopens;
  WO-070-D009's follow-up is allocated to WO-075.
- **Declined alternatives, recorded:** a Git subtree or submodule of core;
  publishing packages; carrying the package source so the export builds and
  runs core's suites (the title, criterion 3, WO-075's assumption and
  ADR-0006's amendments keep it in core; reopened by the operator at
  review); a kit-only test runner (it breaks the byte identity criterion 1
  requires).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `scripts/launchpad.mjs` (new): a `KIT_FILES` allowlist; `readKitSources(root, commit)`
   reading Git blobs at the named commit, never the work tree;
   `kitManifest({ commit, tag, files })` (`schemaVersion: 1`, `files: [{ path, sha256 }]`);
   `exportKit(root, destination, { license })`; the CLI `export <dir> [--license none]`.
   Refuse, before any write, a destination that exists and is not an empty readable
   directory. Resolve every document root through `scripts/lib/config.mjs`
   (`TOOL_ROOT`, `docRelative`, `defaultDocRelative`); `scripts/test-configuration-root.mjs`
   (line 377) refuses a quoted `docs/` literal and an `import.meta.url` root.
   Kit files include the nine build-free `.mjs` modules under `packages/skeleton/src`
   and `packages/compiler/src` that the kit's scripts import (`gate-evidence.mjs` among
   them, which `implementation-ready` reaches through `scripts/lib/gate-evidence.mjs`);
   "package source" in criterion 2 means TypeScript source, so the fixture asserts no
   `packages/*/src/**/*.ts` in the export. `packages/skeleton/loadouts/grants.json` is
   instance authority data (`scripts/lib/authority-grants.mjs`): never a kit file; the
   executor checks at its base whether `authority-grants.mjs` tolerates its absence and,
   if not, writes the minimal valid empty file as an instance seed, not manifest-listed.
2. Same file, `kitLockfile(coreLock, kitPackage)`: prune core's `package-lock.json` (six
   workspaces) to `""`, `packages/beacons`, `node_modules/@dotln/beacons` and the closure
   of the kit's three dev dependencies at core's exact pins (read them from
   `package.json` at the base). The kit `package.json` keeps core's script names.
   Check: `npm ci --offline` in the export (criterion 1).
3. Same file: run `checkLocalTerms(findLaunchpad(), surfaces)` (`scripts/lib/terms.mjs`)
   over every exported text before writing; print `local-terms list: <status>`; an
   empty or malformed list refuses.
4. Templates in `scripts/kit/` (new directory): `CLAUDE.template.md` (the floor: clean room,
   secrets, the resume phrases; the template is not named `CLAUDE.md` because a nested
   file of that name would load into core sessions), `dotln.config.example.json`,
   `README.client.md`, `AI-HARNESS-SECURITY.template.md`, `first-order.template.md`
   (WO-001's shape with `**Effort:**`, the harness smoke, `npm run terms -- check` and the
   four audit topics), the repository-profile and workstream templates, `gitignore.template`
   (which must not ignore `packages/*/dist/`, because WO-075's starter commits its build),
   `LICENSE-PENDING.md`. Product 07 is copied whole. Instance seeds (the first order, the
   root READMEs) are written and never manifest-listed.
5. `package.json`: add `"launchpad": "node scripts/launchpad.mjs"`. Check:
   `npm run launchpad -- export "$(mktemp -d)/kit"`.
6. `scripts/license-surfaces.mjs`: export the pinned `licenseHashes` (line 23) for the
   fixture; under `--license none` the export writes `LICENSE-PENDING.md` only.
7. `scripts/test-launchpad.mjs` (new), one case per criterion: refuses a non-empty or
   unreadable destination before any write; scripts match `UPSTREAM.md`'s commit and the
   manifest hashes verify; offline `npm ci` succeeds; the kit's `resume activate` activates
   the first order without TypeScript source (`git init` and commit as
   `scripts/test-beacon-portability.mjs` lines 93 to 129 do); a transition emits a
   decodable control Beacon; the negative fixture leaves out every planted item (byte-search
   the export for the planted terms hash); terms status `present`, `unavailable`, and an
   empty list refuses; license files pinned or only `LICENSE-PENDING.md`; an unmatched
   attestation records with the advisory. Fixtures commit a temporary copy of the work tree
   because the order stays uncommitted until final review.
8. `scripts/test-runner.mjs`: add `nodeTests("launchpad", "scripts/test-launchpad.mjs", { protects })`
   (`scripts/test-runner.test.mjs` line 941 requires a `protects` string).
   Check: `npm test -- --only launchpad`.
9. Re-mints: point `docs/evidence/current.json` at WO-074 revision 001 for the four kinds;
   `npm run build`; `node scripts/authority-evidence.mjs --write`,
   `node scripts/artifact-identity-evidence.mjs --write`,
   `node scripts/verification-evidence.mjs --write`; `node scripts/feedback-evidence.mjs --carry <the feedback edition selected at the base>`.
   Check each with `--check`.
10. Criterion 6: `DOTLN_LAUNCHPAD=<the main checkout> npm run launchpad -- export <dir>`;
    expect `present`.
11. Write-backs: `docs/product/03-architecture.md` §"## Platform and instance boundary"
    (the kit's first slice, in place); `docs/LEGAL.md` §"## Current state" (a dated
    observation: the kit carries the three license files by default); `docs/README.md`
    §"## Map" (one line naming `scripts/kit/`); `docs/evidence/WO-074/decisions.md`
    (the kit-file decisions of step 1, the in-place `npm test` follow-up, WO-069-D001 and
    D002 dispositions); `node scripts/check-publication.mjs --print-locks` into
    `docs/publication/audience-status-index.md`; `npm run publication:check`.
12. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-074/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the command, the manifest, the templates, the
`package.json` entry, fixtures, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. `launchpad export <dir>` refuses, before any write, a destination that
   exists and is not an empty directory or that it cannot read; the
   exported scripts are byte-identical to the source commit named in
   `UPSTREAM.md` and the manifest hashes verify; an offline `npm ci`
   against the exported lockfile succeeds; with no package source present,
   the kit's own `resume activate` activates the pre-drafted first order
   and `resume status --json` reports it. The export's `npm test` is not
   claimed (Design); the decisions file records it as a follow-up.
2. A lifecycle transition inside the export emits a decodable control
   Beacon without any `packages/skeleton` source present.
3. A negative fixture plants one of each: an intake file,
   `.claude/settings.local.json`, a Beacon output, a runtime store, a
   TypeScript source file of a compiled package, an evidence file of one of
   this repository's orders, and a synthetic local-terms list in its ignored
   location with its SHA-256 in a planted file; the export holds none of
   them and the manifest lists no instance path. The export runs the
   local-terms check over every exported kit text and prints its status: a
   synthetic list with no match prints `present`, no list prints
   `unavailable`, and an empty list refuses the export. The criterion is
   judged against the declared set; a case outside it is a follow-up, not a
   failure.
4. `LICENSE`, `LICENSE-docs` and `NOTICE` are byte-identical to core's (the
   hashes `docs/LEGAL.md` §Decision — 2026-09-06 pins) and manifest-listed;
   under `--license none` the export writes `LICENSE-PENDING.md` in their
   place, a notice that grants no rights and names no license; the fixture
   finds no other license file in either export.
5. Effort attestation inside the export records an unmatched harness
   version or effort as supplied with core's advisory (a fixture attests a
   version the export's discovery record lacks), and the client README says
   that a fresh fork's attestations carry that advisory until it records
   its own discovery.
6. The executor runs the export against a launchpad that holds the
   operator's local-terms list (the main checkout, named by
   `DOTLN_LAUNCHPAD`); it prints `present` and refuses nothing. Only where
   no checkout on the machine holds the list does the executor record this
   criterion unmet with that command; it then closes by a run with the
   list or by a recorded waiver.
7. Write-backs land: 03 §Platform and instance boundary (the kit's first
   slice), in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth, and an overrun is an advisory the next pass reads); WO-075, WO-073 and WO-193 also write product 03
   after this order. `docs/LEGAL.md` §Current
   state (a dated observation, that section's form: the kit carries the
   three license files by default); `docs/README.md` §Map (one line for
   where the kit templates live); the decisions file; the publication locks
   refreshed.
8. The re-mints the Cost line names are recorded; `npm test -- --review`
   and `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the fixture transcripts; the operator's local-terms run
or the recorded fallback; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `scripts/launchpad.mjs` is a declared source
of configuration-root, and again at final review. No live row.

**Write-back duty:** as listed in criterion 7.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected above: product 03 had no headroom
  (176,807 of 176,807) and every 03 co-writer the order named was closed;
  the 2026-10-07 pass reset the ceilings and removed byte bounds.
- Decided by the 2026-10-07 pass (reopen conditions in the planning
  document §8): product 07 is copied whole; templates live in `scripts/kit/`;
  the nine build-free `.mjs` modules are kit files; `grants.json` is an
  instance file; the kit lockfile is pruned from core's (step 2).
- The "executor half of product 07" wording in Cost and Objective is
  superseded by step 4; the executor reads them as the whole file.

**Non-goals:** the runtime build and harness bundle in the export (WO-075);
the overlay (WO-076); update (WO-077); the registry (WO-078); publishing
packages; running core's suites inside the export (operator-review
assumption 2); the repository-profile convention (WO-073) and the
workstream convention (WO-080).

**Operator-review assumptions**

1. The reviewer reads the exported text for any specific host, gateway or
   policy description; generic questions are permitted, descriptions are
   not.
2. A kit without package source cannot run core's suites in place, so
   this order claims the commands that run without a build and records the
   rest as a follow-up. Carrying the package source, or a no-build path in
   core's runner, bootstrap and `npm run harness`, is not taken here;
   reopen when an export must run core's suites in place.
3. The repository-profile and workstream templates follow conventions that
   WO-073 and WO-080 define, both sequenced after this order. The order
   authors both from the sections those orders' texts name, and a later
   change to either convention reaches the kit through its manifest.
4. The repository holds no text for `LICENSE-PENDING.md`; the executor
   writes a notice that grants no rights and names no license, and the
   reviewer checks its wording at final review.
