# WO-208 — Instance extension point: a configured, manifest-excluded location for instance-owned code that the kit's machinery loads through the SourceAdapter port and registers for the sibling ports, never touched by an update, recorded at load and reviewed under the executable-code burden, with a fixture adapter as its first consumer and the enterprise-tracker adapter left to the work instance (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor max; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. A configuration section, a loader, a
`source` selector on vertical issues, a control event and a README section;
the GitHub issue source keeps its behavior as the default. Assigned at
activation under the standing opt-out default.
**Cost:** adds an `extensions` section to the configuration schema in
`scripts/lib/config.mjs` (a root outside every kit tree and a registry of
adapters by kind), a loader `scripts/lib/extensions.mjs` (resolve, contain,
import, validate the export shape, record `ExtensionLoaded`), a `source`
field on vertical issues read by `readVerticalConfiguration` in
`scripts/lib/vertical-runtime.mjs` and selected at the fetch seam in
`prepare()`, a fixture adapter under `scripts/fixtures/extensions/`, cases
in `scripts/test-vertical.mjs` and `scripts/test-launchpad.mjs`, the
`extensions` section in `scripts/kit/dotln.config.example.json`, and a
§Instance extensions section in `scripts/kit/README.client.md`. Removes the
state the record names: the `SourceAdapter` port is prose, the only adapter
lives in core, and an instance has nowhere its own code is loaded from
(FUP-3e22cf6f99f02005). Wall-clock: one dynamic import per declared adapter
at vertical start. Re-mints: `scripts/lib/config.mjs` is a registered import
sibling the editions deliberately exclude (`scripts/lib/evidence-sources.mjs`
line 362 onward), and `scripts/lib/vertical-runtime.mjs` is not registered,
so no edition re-mint and no live feedback episode; the vertical suite is a
product suite and the launchpad a declared machinery source, so
`npm test -- --review` runs before handoff. Tokens and context bytes are
unknown until run.
**Nomination provenance:** operator direction of 2026-10-11, item (g) of the
three-repository route dispatch (ignored capture, SHA-256
`d570ff00e50f064027423cfaec2c0ae4de4ecc19c33282bef1a1f474bfa09bc8`), and
the operator's tenth message in the conversation-only session the same day
(ignored capture, SHA-256
`f4fbb3cf35c2608244f373f1b12c404cc724dbb2dc838a80c6795e5d3c287d85`): the
work fork will have its own functionality, an enterprise-tracker import and
the v1 integration among it, while base machinery still arrives as an
update. The register row FUP-3e22cf6f99f02005 (the 2026-10-02 candidate "a
port for an instance-owned source adapter") waited for a request from an
instance; the direction is that request. Planner-synthesized. Opaque
identifier, not a priority. Clean-room screen: the enterprise tracker is
named only by the generic term; no adapter for it exists or is described
here; the fixture adapter reads a local JSON file.
**Depends on:** WO-076 (hard: the convention that instance-owned files
compose over the kit and stay out of the manifest, which the extension root
follows); WO-112 merged (closed: the vertical's intake and the fetch seam);
WO-060 merged (closed: `decodeSourceBundle`, the port's input contract).
**Recommended placement:** in the serial tail after WO-207 and before
WO-209. This order edits `scripts/lib/config.mjs`, a new library,
`scripts/lib/vertical-runtime.mjs`, two fixture suites, the kit's example
configuration and README, and products 03 and 12; WO-209 edits
`scripts/lib/config.mjs` after it. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance-owned, manifest-excluded convention the extension root follows"
  },
  {
    "workOrderId": "WO-112",
    "relation": "satisfied-by-close",
    "reason": "the vertical's intake and the fetch seam the adapter plugs into"
  },
  {
    "workOrderId": "WO-060",
    "relation": "satisfied-by-close",
    "reason": "decodeSourceBundle, the port's input contract every adapter's output passes through"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary, §Package ecosystem and marketplaces (integration packs; the
executable-code review burden; "Distribution never implies activation") and
§Ports (`SourceAdapter`, `decodeSourceBundle`, the declared screen);
12-workstream-application.md §Arriving at the desk (the work instance);
`docs/decisions/0002-kernel-first-agentic-core.md` Decision 2 (the
enterprise-tracker adapter as a future optional plug-in outside core);
`scripts/lib/config.mjs` (`SECTION_KEYS` at line 94, `validateBuild` at
lines 318 to 327 as the model, `resolveRoots`); `scripts/lib/vertical-runtime.mjs`
(`readVerticalConfiguration` from line 160 with the issue keys at lines 204
to 231, `prepare()` and the fetch seam `external.fetchIssueBundle ??
fetchIssueBundle` at line 524, `requireCompleteIssueBundle`);
`packages/skeleton/src/github-issue-source.ts` (`fetchIssueBundle` at line
409, `IssueBundleResult` at line 85, `IssueSourceRefusal` at line 92);
`packages/compiler/src/source-bundle.ts` (`SourceBundle` at line 54,
`decodeSourceBundle`); `scripts/launchpad.mjs` (`KIT_FILES` trees at line
152, `planUpdate`'s `instance-owned collision` rule); `scripts/kit/dotln.config.example.json`;
`scripts/kit/README.client.md`; the
[2026-10-11 route planning document](../planning/three-repository-route-2026-10-11.md)
§5.

**Objective:** `dotln.config.json` may declare `extensions`: a root directory
outside every kit tree (default `extensions/`) and adapters by kind
(`source`, `effect`, `projection`), each `{ id, module }` relative to the
root. The kit's machinery loads a declared `source` adapter through the
`SourceAdapter` port: a vertical issue may name `source: "<id>"`, and
`prepare()` then calls that adapter's `fetchBundle(reference, { directory,
cwd })` in place of `fetchIssueBundle`, requires the same result shape, and
passes its bundle through `decodeSourceBundle` and the declared screen
exactly as the GitHub source's; `effect` and `projection` adapters are
admitted, validated and listed for the ports that will consume them, with no
consumer in this order. Every load records `ExtensionLoaded { id, kind,
path, sha256 }` in the control log. The extension root is never manifest-
listed, never exported from core, and never touched by an update; the client
README states the review burden an instance takes on by loading its own
code. The first consumer is a fixture adapter in core's suites; the
enterprise-tracker adapter is written in the work instance, never here.

**Observed gap (dated 2026-10-11, `main` at `82b7fdb7`):**

- The `SourceAdapter` port is prose in product 03 §Ports; the only adapter is
  `fetchIssueBundle` in `packages/skeleton/src/github-issue-source.ts`
  (line 409), and `prepare()` in `scripts/lib/vertical-runtime.mjs` calls it
  through `external.fetchIssueBundle ?? fetchIssueBundle` (line 524), a seam
  the tests use and no configuration reaches.
- `readVerticalConfiguration` admits issue keys `number`, `draftId`,
  `inferences`, `revisionId`, `baselineAssessment` and `intake` (lines 204
  to 231); nothing names a source.
- The configuration's sections are `version`, `roots`, `repositories`,
  `classes`, `build`, `release`, `kit`, `derivedOrders` and `portfolios`
  (`SECTION_KEYS`, line 94); an unknown section refuses.
- Instance files are documents, configuration and overlays (the client
  README §Kit files and instance files); an unlisted directory survives an
  update (`planUpdate` refuses a new kit path an instance file occupies),
  but nothing loads code from one.
- ADR-0002 Decision 2 keeps the enterprise-tracker adapter a future optional
  plug-in outside core; product 03 §Package ecosystem names integration
  packs and the higher review burden executable code carries; nothing
  implements either.
- FUP-3e22cf6f99f02005 was deferred on 2026-10-02 until an instance's
  request asked for the port; the operator's direction of 2026-10-11 is that
  request.

**Design (scope discipline):**

- One root, declared, outside the kit: `extensions.root` is a relative path
  that may not lie under `scripts/`, `packages/`, `docs/` or any kit path
  (`kitPath` decides) and may not be a symlink; every module path is
  contained in it. Core's own configuration declares none, so the export
  never carries an extension and the fixture asserts the manifest lists no
  path under the root.
- Loaded only when registered, recorded when loaded: `loadExtension(root,
  entry)` resolves the module, refuses an uncontained or symlinked path,
  imports it by file URL, validates the export (`{ id, kind, fetchBundle }`
  for `source`; `{ id, kind }` plus the port's shape for the others), and
  appends `ExtensionLoaded` with the module's SHA-256. An adapter whose
  export shape is wrong is a typed refusal naming the id.
- The port's contract is the GitHub source's: `fetchBundle(reference, {
  directory, cwd })` returns `IssueBundleResult` (`bundle`, `receipt` with
  `refused` and omissions); `requireCompleteIssueBundle` and the declared
  screen run unchanged; a bundle that fails `decodeSourceBundle` refuses by
  path. The adapter never sees the model or the worktree.
- Selection is per issue: `source: "<id>"` on a vertical issue selects the
  adapter; absent means the GitHub source. `referencesIssue` keeps its URL
  rule for GitHub issues; an adapter supplies the reference string its
  tracker uses, and the draft must name it the same way (the adapter
  exports `referenceFor(number)`).
- `effect` and `projection` adapters are admitted, validated and listed by
  `extensions.list(kind)` for the ports that will consume them (the publish
  port and the view-model projections); no consumer is wired here, and the
  README says so.
- Review burden stated, not enforced here: the README names what an
  instance takes on (code with filesystem, network and credential reach,
  loaded into the vertical's process), the record it gets (`ExtensionLoaded`
  with the hash) and the rule that an adapter change is reviewed like any
  source change in the instance; the harness's refusals judge the vertical's
  effects as today.
- v1 mining stays with WO-194 and FUP-0115; an adapter reads a tracker, it
  does not import rules.
- **Declined alternatives, recorded:** adapters inside the kit tree
  (replaced by updates; the operator's edit would be refused); a package
  registry or marketplace (product 03 names it as a later catalog adapter);
  wiring the effect and projection consumers here (no consumer exists in an
  instance yet; the request route brings the need); an adapter API richer
  than the GitHub source's (one contract, proven by the existing source).

**Execution plan (the executor follows these steps in order; observed at `82b7fdb7`, 2026-10-11):**

1. `scripts/lib/config.mjs`: `SECTION_KEYS` (line 94) gains `extensions`;
   `validateExtensions(path, declared)` modelled on `validateBuild` (lines
   318 to 327): `root` a relative, non-kit, non-symlink directory (default
   `extensions`), `adapters` an array of `{ id, kind, module }` with `kind`
   in `source`, `effect`, `projection`, ids unique, modules relative paths
   inside the root; the loaded configuration carries `extensions: { root,
   adapters }` with `{ root: "extensions", adapters: [] }` as the absent
   default. Check: cases in the configuration suite (`scripts/test-config*.mjs`,
   whichever declares `config.mjs` in `machinerySources`).
2. `scripts/lib/extensions.mjs` (new): `loadExtension(launchpad, entry)` and
   `listExtensions(launchpad, kind)`; containment through the existing
   contained-path helpers; `import(pathToFileURL(...))`; shape validation
   per kind; `ExtensionLoaded` appended through the control-log writer the
   vertical uses. Check: unit cases in `scripts/test-extensions.mjs` (new;
   add to `machinerySources`).
3. `scripts/fixtures/extensions/fixture-source-adapter.mjs` (new): exports
   `{ id: "fixture", kind: "source", referenceFor, fetchBundle }` reading a
   local JSON file into an `IssueBundleResult`-shaped result. Check: step 4.
4. `scripts/lib/vertical-runtime.mjs`: `readVerticalConfiguration` admits
   `source` (a declared adapter id, else refuse naming it) on an issue;
   `prepare()` selects `external.fetchIssueBundle ?? adapterFor(issue) ??
   fetchIssueBundle` at line 524, with the adapter's `referenceFor` used
   where `referencesIssue` builds the expected URL; everything after the
   fetch is unchanged. Check: a `scripts/test-vertical.mjs` case runs the
   fixture vertical with `source: "fixture"` from intake to contract and
   asserts `ExtensionLoaded` in the log; a case with an undeclared id
   refuses at configuration.
5. `scripts/test-launchpad.mjs`: cases: an export from a core checkout that
   declares no extensions carries no path under `extensions/` and the
   manifest lists none; in a fixture instance with an adapter under
   `extensions/`, an update leaves the directory byte-identical and refuses
   a planted kit path inside it as an instance-owned collision. Check:
   `npm test -- --only launchpad`.
6. `scripts/kit/dotln.config.example.json`: the `extensions` section with
   the default root and an empty adapter list. Check: the WO-074 fixture's
   `loadConfig` of the example equals the defaults.
7. `scripts/kit/README.client.md`: §"## Instance extensions" after §Kit files
   and instance files: the root, the registration, what a `source` adapter
   must export, the record it gets, that `effect` and `projection` adapters
   are listed and not yet consumed, the review burden, and that the
   enterprise-tracker adapter belongs to the instance that needs it. Check:
   the README travels manifest-listed.
8. Write-backs (each heading re-read at the base): `docs/product/03-architecture.md`
   §"## Ports (what keeps work-flavored verticals pluggable)": the
   `SourceAdapter` bullet gains the instance-side binding (a declared
   adapter at the extension root, loaded and recorded), in place; §"### Package
   ecosystem and marketplaces": one clause that the extension root is where
   an instance's integration pack lives today; `docs/product/12-workstream-application.md`
   §"## Arriving at the desk": the work-instance sentence on the adapter
   gains its evidence; `docs/evidence/WO-208/decisions.md`;
   `node scripts/lineage.mjs index --check`;
   `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`;
   `npm test -- --review`; complete `docs/evidence/WO-208/handoff.md`;
   `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the configuration section; the loader and its record; the
`source` selector; the fixture adapter; the fixture cases; the example
configuration and README; the write-backs below.

**Acceptance criteria (all required)**

1. A configuration declaring `extensions` with a root under a kit tree, a
   symlinked root, an uncontained module, a duplicate id or an unknown kind
   refuses naming the key; the absent section loads as the default root with
   no adapters (configuration cases).
2. The fixture vertical runs from intake to contract with an issue naming
   `source: "fixture"`: the fixture adapter's bundle passes
   `requireCompleteIssueBundle`, the screen and `decodeSourceBundle` as the
   GitHub source's does, and the control log holds `ExtensionLoaded` with the
   module's SHA-256; an issue naming an undeclared id refuses at
   configuration; an adapter with a wrong export shape refuses naming the id
   (vertical and extension cases).
3. `effect` and `projection` adapters declared in the fixture are loaded,
   validated and listed by kind, and no consumer runs them (extension cases).
4. An export from a core checkout carries no path under the extension root
   and the manifest lists none; in a fixture instance an update leaves the
   extension root byte-identical and refuses a planted kit path inside it
   (launchpad cases).
5. The client README's §Instance extensions states the root, the
   registration, the `source` contract, the record, the unconsumed kinds and
   the review burden; the example configuration carries the section.
6. Write-backs land, each in place with no dated paragraph: product 03 §Ports
   (the binding) and §Package ecosystem (the clause); product 12 §Arriving at
   the desk (the evidence); the decisions file; the publication locks
   refreshed. No byte figure binds these write-backs.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the configuration, extension, vertical and launchpad
cases; `npm run test:docs`; `npm test -- --review` before
`implementation-ready` and again at final review.

**Write-back duty:** as listed in criteria 5 and 6.

**Known issues and carry-ins:**

- FUP-3e22cf6f99f02005 is allocated here: the operator's direction is the
  request its reopening condition awaited.
- The enterprise-tracker adapter is the work instance's first extension and
  is never written in core; what it needs beyond this contract arrives as a
  WO-193 request.
- The effect and projection kinds have no consumer here; the first consumer
  is a later order, named by the request that asks for it.

**Non-goals:** any tracker-specific adapter in core; v1 mining or rule import
(WO-194, FUP-0115); consumers for effect and projection adapters; a package
registry or marketplace; sandboxing an adapter's process beyond the
vertical's existing confinement; the build channel (WO-209).

**Operator-review assumptions**

1. The GitHub source's result shape is the port's contract; an adapter that
   needs more opens a WO-193 request.
2. Loading instance code into the vertical's process under the harness's
   existing refusals is the accepted boundary for a first consumer; a
   stronger isolation is a later decision.
