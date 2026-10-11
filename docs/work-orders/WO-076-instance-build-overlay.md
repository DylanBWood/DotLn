# WO-076 — Instance build overlay: a fork's `build/overlay.json` composes over the kit's Contributor build to replace the identity, unequip units, narrow the envelope, widen it only by provenance-bearing grants, or declare no build (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. An overlay schema and its composition in
`harness emit`; no kit law change. Assigned at activation under the standing
opt-out default.
**Cost:** adds the overlay's positive decoding and its composition in
`harness emit` (`scripts/harness.mjs`, `scripts/lib/harness.mjs`), the
overlay's hash in the manifest, fixture overlays, the client README
template's first section, a note in ADR-0006 and at most 200 bytes in
product 10. Removes the need to edit kit files to change a fork's build:
`harness emit` admits one loadout and the support switches are a
programmatic option no command sets. WO-118 depends on it. Re-mints:
deterministic, the authority and harness editions that
`scripts/lib/harness.mjs` stales (it is registered in those two and
excluded with a reason from the other three); with no overlay declared the
committed bundle does not change. If the composition is placed in
`packages/compiler/src/harness.ts`, a common source, each edition it stales
is re-minted and the compiler release carries the feedback edition
(`feedback-evidence --carry`), re-pins the console and moves the console
self-host fixtures that hold the compiler label (WO-154 D011; WO-162 D012);
no source the feedback verifier judges is edited, so no live episode.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-033's "kit, instance, and the instance's
build overlay" item, cut into a bounded child at the operator's 2026-09-08
correction; the vision's rule that the platform prescribes no loadout.
Planner-synthesized draft. Opaque identifier, not a priority. Clean-room
screen: no stop condition. Amended by the 2026-09-28 planning pass, which
re-observed the order on `main` at `5f3849ec`: registration and classes
stay in the configuration, the overlay's path is the configuration's
`build.overlay`, input the overlay cannot hold refuses, and the registered
source and the write-backs are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-075 merged (the kit build the overlay composes over);
WO-074 merged (the client README template this order writes into); WO-042
merged (widening within the fork's posture is a provenance-bearing
grant; closed, v0.16.0).
**Recommended placement:** in the serial run after WO-073 and before
WO-077. This order edits `scripts/harness.mjs`, `scripts/lib/harness.mjs`,
the client README template, ADR-0006 §Amendments and product 10; WO-077
edits the client README template after it. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "the kit build the overlay composes over"
  },
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "the client README template this order writes into"
  },
  {
    "workOrderId": "WO-042",
    "relation": "hard",
    "reason": "widening within the fork's posture is a provenance-bearing grant"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §Common substrate, local
doctrine; ADR-0006 Decisions 1 and 7 and §Amendments; 02-domain-model.md
§LoadoutGraph v1 payload contract (grants after WO-042);
`packages/compiler/src/harness.ts`; `scripts/lib/harness.mjs`
(`harnessInstallation`: the one admitted loadout);
`packages/skeleton/src/loadouts/contributor.ts`
(`contributorConfiguredProgram`: the support switches);
`scripts/lib/config.mjs` (the `build` section) and 07-execution-guide.md
§Where the control plane finds its documents;
`docs/evidence/WO-069/decisions.md` D001; 10-ir-compatibility.md §Separate
version axes; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history only
(the Design bullet led "Kit, instance, and the instance's build overlay are
separate sets of files.").

**Objective:** The overlay (instance-owned, never in the manifest; at the
path the configuration's `build.overlay` names, `build/overlay.json` by the
kit's convention) declares extra units, envelope narrowings, grants with
`operator` or `host-policy` provenance, an identity replacement, unequipped
units, or `build: none`; `harness emit` composes it over the kit's
Contributor build to produce the fork's own `.claude/`, and `harness check`
verifies the result; under `build: none` the emit produces only the
hand-written floor. The fork's registered repositories and classes stay
where the configuration declares them.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- `harness emit` admits one loadout, `contributor`; the configuration's
  `build` section (`loadout`, `profile`, `overlay`) is validated and read by
  no script; the support switches exist only as an option of
  `contributorConfiguredProgram` that no command sets.
- Registration lives in `dotln.config.json`: an id-keyed `repositories`
  section with base branch, worktree parent, class and authority profile
  (WO-071). An overlay that also declared repositories and classes would be
  a second home for both.
- The configuration already carries the overlay's path as the free string
  `build.overlay`; WO-069-D001 reopens when a first consumer of `build`
  finds the declared shape insufficient.
- `scripts/harness.mjs` was 81 lines at `33e2c25` and is 332 at `5f3849ec`,
  `scripts/lib/harness.mjs` 243 and 848, `packages/compiler/src/harness.ts`
  656 and 1,226; the executor re-measures at its base.

**Design (scope discipline):**

- Composition is deterministic and recorded in the manifest with the
  overlay's hash; widening beyond the kit build's base is only a grant
  under WO-042's floor.
- The overlay composes the build only. Repositories and classes are
  declared where WO-071 and WO-073 put them, and the overlay does not
  repeat them.
- The overlay's path is the configuration's `build.overlay`; with none
  declared, `harness emit` composes nothing and its output is today's.
- The overlay is decoded positively: its keys are a closed list, each
  composed through the floor. A file that is not JSON, holds an unknown key
  or cannot be read refuses the emit, naming the path and the key, and
  writes nothing.
- The executor records whether WO-069-D001 reopens.
- **Declined alternatives, recorded:** editing kit files in the fork
  (breaks update); an overlay that can bypass the floor; the overlay as a
  second home for registration and classes (two sources for one fact;
  reopen if a fork needs a registration that differs per build).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `scripts/lib/harness.mjs`: add `OVERLAY_KEYS` (`version`, `build`, `identity`,
   `unequip`, `equip`, `narrow`, `grants`) and `decodeBuildOverlay(path, text)`, which
   throws `invalid build overlay in <path>: <detail>` naming the key for non-JSON, an unknown
   key or a wrong type. `readBuildOverlay(launchpad)` resolves `loadConfig(launchpad).build.overlay`
   through `containedRegularFile` (`scripts/lib/paths.mjs` line 14) and refuses an unreadable
   file. Grants accept `grantedBy` `operator` or `host-policy` only
   (`packages/kernel/src/types.ts` line 109). "Extra units" means the support switches the
   kit build already defines (`contributorConfiguredProgram`, `contributor.ts` line 685);
   the tree has no data-defined unit catalog, so `equip` and `unequip` name those switches.
2. `packages/skeleton/src/loadouts/contributor.ts`: give `contributorProgram(supportIds, overlay)`
   an optional overlay applied to `contributorWithSupports(supportIds)` before
   `compileLoadout` (lines 628 to 684), so an ungranted widening fails with
   `AUTHORITY WIDENING` (`packages/compiler/src/authority.ts` line 61). This file is a
   registered evidence source (authority, feedback and harness inventories) and not in
   `FEEDBACK_SOURCE_PATHS`, so it owes re-mints and no live episode. Check: `npm run build`.
3. `scripts/lib/harness.mjs`: `harnessInstallation(options)` accepts `options.overlay`; it maps
   `unequip` and `equip` to the switches, passes the rest to step 2, and adds
   `overlay: { path, sha256 }` to the installation manifest only when an overlay exists, so the
   bytes with no overlay stay the same. `build: "none"` returns no generated files and
   `emitHarness` writes the floor alone; `.claude/harness-manifest.json` stays, listing no
   installed surfaces, so `harness check` keeps a subject.
4. `scripts/harness.mjs`: for `emit` and `check` without `--target`, set
   `options.overlay = readBuildOverlay(findLaunchpad())` beside `options.termsRoot = root`
   (line 319). A refusal happens before any write.
5. `scripts/test-harness.mjs` (the `harness-fixtures` row), cases: overlay narrowing re-emits
   with only the declared diff; identity replacement and two unequips leave neither;
   `build: none` emits the floor and `check` passes; an ungranted widening refuses
   `AUTHORITY WIDENING`; a granted widening records provenance; non-JSON, unknown-key and
   unreadable overlays refuse by path and write nothing; no overlay reproduces today's bytes.
   Check: `npm test -- --only harness-fixtures`, then `node scripts/harness.mjs check`.
6. Re-mints: point `docs/evidence/current.json` authority at WO-076 revision 001;
   `node scripts/authority-evidence.mjs --write`; `npm run build`;
   `node scripts/feedback-evidence.mjs --carry <the edition selected at the base>`;
   `npm test -- --only harness-evidence` re-checks the harness inventory (it has no
   `--write`; "the harness edition" in the Cost line means this inventory check).
7. Write-backs: `scripts/kit/README.client.md` (WO-074), first section: the Contributor
   build is starter content, not kit law, and the overlay owns the fork's build;
   `docs/decisions/0006-platform-mechanisms-instance-doctrine.md` §"## Amendments": one dated
   bullet in the existing form; `docs/product/10-ir-compatibility.md` §"## Separate version
   axes": the overlay schema axis, in place; `docs/evidence/WO-076/decisions.md` (WO-069-D001's
   disposition, the composition placement); `node scripts/check-publication.mjs --print-locks`
   into `docs/publication/audience-status-index.md`; `npm run publication:check`.
8. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-076/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the schema, the composition, fixtures, the client README
section, the write-backs below.

**Acceptance criteria (all required)**

1. A fixture overlay that narrows the envelope re-emits to a bundle that
   differs from the kit's only where the overlay says (a recorded diff).
2. A second overlay that replaces the identity and unequips two units
   re-emits to a bundle carrying neither; a third that declares
   `build: none` re-emits to the floor alone with `harness check` passing.
3. An overlay that widens without a grant refuses with `AUTHORITY WIDENING`;
   with a grant it emits and the manifest records the provenance.
4. An overlay that is not JSON, one with an unknown key and one that cannot
   be read each refuse the emit, naming the path, and write nothing; with
   no overlay declared the emit equals today's bytes. The criterion is
   judged against the declared set; a case outside it is a follow-up, not a
   failure.
5. Write-backs land: the client README template's first section (the
   Contributor build is starter content, not kit law, and the overlay owns
   the fork's build); ADR-0006 §Amendments (a dated note, the section's
   form); 10 §Separate version axes (the overlay schema), in place with no
   dated paragraph (ceilings are planning's: the 2026-10-07 pass set every
   product document's ceiling at measured bytes plus one tenth); WO-091,
   WO-092, WO-097 and WO-194 also write product 10. The
   decisions file, with WO-069-D001's disposition; the publication locks
   refreshed.
6. The re-mints the Cost line names are recorded; `npm test -- --review`
   and `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the fixture transcripts and the recorded diff;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `scripts/lib/harness.mjs` is a declared source of harness-fixtures,
and again at final review. No live row.

**Write-back duty:** as listed in criterion 5.

**Known issues and carry-ins:**

- 2026-10-11 standard pass: FUP-44639ec9a751d8d1 (WO-075 D008) is
  allocated here: emit the Start here `Read[role]` directives from the
  compiled Contributor bundle instead of hand-writing them in core's
  `CLAUDE.md` floor and the kit's `CLAUDE.template.md`, so the two floors
  cannot drift; `harness emit` is this order's surface. Fix it inside the
  Boy Scout bound or record it as left in the decisions.
- Stale on 2026-10-07 and corrected above: product 10 headroom (950, not
  507) and its co-writers; the Observed gap's line counts (now 337, 853 and
  1,376); the Cost line's "harness edition" is the inventory check of step 6.
- Decided by the 2026-10-07 pass: the overlay keys of step 1; "extra units"
  are the existing support switches; `build: none` keeps the manifest; the
  composition is a parameter on `contributorProgram` (`contributor.ts`, now
  a declared surface with its re-mints). Reopen: a fork needs a unit the
  switches do not name.
- Blocked on WO-074 (the client README template's path and first heading)
  and WO-075 (an export to compose over; the core fixtures are not blocked).

**Non-goals:** update (WO-077); registration semantics (WO-071); class
semantics (WO-073); composition outside the floor.

**Operator-review assumptions**

1. `host-policy` provenance is the fork's own harness posture; the reviewer
   checks that each overlay key composes through the floor (criteria 3 and
   4).
2. Registration and classes stay in the configuration; the umbrella this
   order was cut from had the overlay declare them. If the operator wants
   the overlay to carry them, the configuration and the overlay become two
   sources to reconcile.
