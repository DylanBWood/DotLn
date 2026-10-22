# WO-225 — The console's host contracts for an instance's browser shell: `board --json` carries no absolute path, the kit ships the two schemas and runs the console without a build, the collector reads an instance's control segments, and the resident's loopback serves the status file and a board snapshot read-only to a local origin (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. Two read-only loopback routes, a board
snapshot the resident writes, coded failure reasons in the board, two kit
files, a build script that is a no-op in a kit root, and a control reader
that admits an instance's segments; `uifa-board-v1` and `runtime-status-v1`
keep their labels (every change is additive or a reason's wording). Assigned
at activation under the standing opt-out default.
**Cost:** adds, in `packages/console/src/collect.ts`, coded failure
reasons in `attempt()` and the store readers, an optional legacy control
log and configured roots in `controlLog`, and a path-free `age` cell for a
refused Beacon row; in `packages/skeleton/src/console-loopback.ts`, `GET
/runtime-status-v1` and `GET /uifa-board-v1`; in
`packages/skeleton/src/resident-host.ts`, the board snapshot written
atomically beside `runtime-status-v1.json` by a bounded child run of the
console CLI; in `packages/console/src/console-client.ts`, the two read
functions; in `scripts/launchpad.mjs`, the two schema files in `KIT_FILES`;
in `scripts/build.mjs`, the kit-root no-op; fixture cases in
`packages/console/test/board.test.ts`, `collect.test.ts`,
`packages/skeleton/test/console-loopback.test.ts`,
`scripts/test-launchpad-export.mjs` and `scripts/test-launchpad-update.mjs`;
the console README's header, version and names; product 04's sentences
step 11 names. Removes the state the fork's UI pass met: a board whose
failure reasons name the home directory (scrubbed by hand before a fixture
could be committed), an export whose `npm run console` fails on a missing
`tsconfig.json`, a board whose Work panel is empty in an instance with
eight closed orders, a contract an instance pins by reaching into core,
and a browser shell with no platform route to the board or the status.
Re-mints: `scripts/build.mjs` is a registered evidence source
(`scripts/lib/evidence-sources.mjs` line 118), so each edition whose check
it stales is re-minted deterministically, the feedback edition by carry
(`build.mjs` is not in `FEEDBACK_SOURCE_PATHS`); `packages/console/src/index.ts`,
`scripts/launchpad.mjs` and `scripts/build.mjs` are declared machinery
sources, so `npm test -- --review` runs before handoff; no live feedback
episode is owed unless a step edits a `FEEDBACK_SOURCE_PATHS` file, in
which case the executor runs one on Codex `gpt-6.1-sol` at `max` or Claude
Code `claude-opus-5-5` at `xhigh`, no authorization needed. Wall-clock: a
board snapshot costs one console collection per refresh (the fork measured
261 ms for `board --json` in a bounded probe; core's `collectSources`
median is 0.9 s); the loopback read is a file read. Context bytes: this
file, about 24,000. Steps: 12.
**Nomination provenance:** the fork's UI planning pass of 2026-10-21
(`docs/planning/ui-planning-2026-10-21.md` §4, §6 and §11 in the operator's
instance, read without a write), items 2 to 5 and 7 of its request block,
carried in the operator's planning dispatch of 2026-10-21 (ignored capture,
SHA-256 `4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`);
the operator's note 5 of the same dispatch (the console serves operator
flow; UI state apart from control records; the shell used from one checkout
while changed from another); FUP-280abd447f789958's fired condition (the
fork filed its console order); the 2026-10-21 pass's read of the console,
kit and loopback sources. Planner-synthesized by the [2026-10-21
pass](../planning/fork-notes-and-operator-questions-2026-10-21.md). Opaque
identifier, not a priority. Clean-room screen: the target is the operator's
own public repository; no target code enters.
**Depends on:** WO-032 (closed, v0.14.0: the actor board and
`uifa-board-v1`), WO-114 and WO-115 (closed: the loopback and the parity
contract), WO-164 (closed: the one-process status fold), WO-213 (closed,
v0.83.0: private paths in every record, whose rule the board now meets).
WO-220 (the console's boarded rows) and WO-080 (the board's Workstreams
section) are referenced with no typed edge: whichever runs second rebases.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-032",
    "relation": "satisfied-by-close",
    "reason": "the actor board, its view model and the console package this order extends"
  },
  {
    "workOrderId": "WO-114",
    "relation": "satisfied-by-close",
    "reason": "the resident's loopback server the read routes join"
  },
  {
    "workOrderId": "WO-115",
    "relation": "satisfied-by-close",
    "reason": "the parity contract whose one-route sentence this order amends"
  },
  {
    "workOrderId": "WO-213",
    "relation": "satisfied-by-close",
    "reason": "the private-path rule the board's reasons now meet"
  },
  {
    "workOrderId": "WO-220",
    "relation": "reference-only",
    "reason": "its console rows edit the same package; whichever runs second rebases"
  },
  {
    "workOrderId": "WO-080",
    "relation": "reference-only",
    "reason": "the board's Workstreams section is an additive view-model extension beside this order's additive changes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 04 §Console parity contract v1
(lines 160 to 268: the one route, the origin and token rules, `console
board` outside the contract, a new command needs a named order), §Plural UI
hosts, one projection contract (the status file omits physical paths; a
later loopback consumer can carry the same model), §Actor board v0, §Later
console hosts (as the 2026-10-21 pass rewrote it, including the
operator-flow paragraph); product 13 §UIFA roles; `packages/console/README.md`
(the header, §Live runtime status, §Contract for another UI host, the
`runtime-status-v1` label rule at lines 229 to 231);
`packages/console/src/collect.ts` (`attempt` lines 26 to 35, `controlLog`
lines 105 to 120, `orderIds` 121 to 123, the fold and fallback 134 to 171,
the stores 244 to 258, `requestedStores` 249 to 256);
`packages/console/src/context.ts` (lines 23 to 45); `text-sources.ts`
(lines 235 to 240) and `work.ts` (lines 99 to 104, 205 to 230);
`packages/beacons/src/control-beacon-fs.mjs` (lines 94 to 120, 430 to 431);
`packages/skeleton/src/console-loopback.ts` (`decode` lines 417 to 462,
the token lines 79 to 128, the command lane 397, receipts 498 to 590);
`packages/skeleton/src/console-commands.ts` (lines 9 to 74);
`packages/skeleton/src/resident-host.ts` (the loopback start at 376 to
381, the status publication); `packages/console/src/console-client.ts`;
`scripts/launchpad.mjs` (`RUNTIME_PACKAGES` lines 94 to 99,
`RUNTIME_OUTPUT` 101 to 102, `KIT_FILES` 197 to 203, `kitPackage` 374 to
387, `kitManifest` 363 to 372); `scripts/build.mjs` (lines 70 to 73, 153 to
182); `packages/skeleton/src/runtime-inputs.mjs` (`isKitRoot` lines 84 to
90); `scripts/lib/control-store.mjs` (`readControl` lines 100 to 129);
`scripts/lib/control.mjs` (`controlPaths` lines 646 to 653);
`scripts/kit/README.client.md` lines 486 to 490; the [2026-10-21 planning
document](../planning/fork-notes-and-operator-questions-2026-10-21.md) §5.

**Objective:** An instance's Angular shell reads the platform through
contracts the kit carries, and nothing in them names a machine:

- **The board carries no absolute path.** Every failure reason in `board
  --json` is a coded reason (`not found`, `not readable`, `command failed
  (exit N)`, `timed out`) rather than the raw error message; the
  constellation's refused Beacon row shows its reason and no directory;
  a fixture with a missing store and a missing control log produces a JSON
  document in which no string contains the fixture root, `process.execPath`
  or the home directory.
- **The kit carries the contracts and runs the console.**
  `packages/console/uifa-board-v1.schema.json` and
  `runtime-status-v1.schema.json` are kit files, listed in the manifest and
  found by the carried `dist/test` cases; `npm run build` in a kit root
  prints that the carried runtime is the build and exits 0 without writing,
  so `npm run console`, `npm run dotln`, `npm run skeleton` and `npm run
  harness` run in an export as they do in core.
- **The collector reads an instance.** `control:canonical-segments` reads
  the legacy `docs/control/resume.jsonl` only when it exists and the
  per-order segments from the configured control root, as `readControl`
  does, so the Work panel's orders and the Actors panel's control actors
  are available in an instance with segments only; the WO-164 cross-check
  of the status fold against the log holds when both are available.
- **A local browser origin can read the board and the status.** The
  resident's loopback serves `GET /runtime-status-v1` (the atomically
  written status file) and `GET /uifa-board-v1` (a board snapshot the
  resident writes atomically beside it, refreshed by a bounded child run of
  the console CLI when a read finds it older than its freshness bound) to
  `127.0.0.1` with the matching Host, a local Origin and the bearer token,
  outside the command lane, without receipts; a non-local origin, a wrong
  Host or a missing token is refused as the command route refuses them.
- **The names are current.** The console README's header names the
  current component version and application release and reads `UIFA v0`
  as the actor board exported as `uifa-board-v1`, `console v1` and the
  `UIFA v1 shell` as the instance's Angular shell; product 04's one-route
  sentence names the two read routes.

**Observed gap (dated 2026-10-21 at `main` `926b8234`):**

- `attempt()` (`packages/console/src/collect.ts` lines 26 to 35) returns
  `Source could not be read or its declared format was refused: ${error.message}`;
  Node's `fs` and `execFileSync` messages carry the absolute `join(root, …)`
  path and the absolute node binary; the reason reaches `sources[].explanation`
  and `panels[].sections[].explanation` (`context.ts` lines 23 to 45) and
  the store sections (`actors.ts` 469 to 473, 547 to 551); a requested
  store's ref is scrubbed but its reason carries `join(resolve(directory),
  "events.jsonl")` (249 to 256); the constellation's refused row renders
  `Beacon <address> | refused | <reason>: <absolute directory>`
  (`control-beacon-fs.mjs` 430 to 431) into the `age` cell (`work.ts` 217
  to 219). The schema constrains none of these strings and the host
  collection test asserts only `unavailable`. The fork scrubbed six paths
  by hand before committing its fixture.
- The kit carries `packages/console/package.json` plus `dist/src` and
  `dist/test` (`scripts/launchpad.mjs` lines 197 to 203, 830 to 855) and
  neither schema; the instance's `KIT-MANIFEST.json` (v0.88.0, 977 files)
  has no `schema.json` entry; the carried `dist/test/board.test.js` reads
  the schema at module load and its row is core-only in a kit.
- `kitPackage` (lines 374 to 387) copies core's scripts verbatim, so the
  export's `console` script is `npm run build --silent && node
  packages/console/dist/src/cli.js`; an export has no `tsconfig.json` and
  `scripts/build.mjs` copies it unconditionally (line 73), so the script
  fails before the CLI runs; the kit README (lines 486 to 490) says the
  build-first commands need the omitted source.
- `controlLog` (lines 105 to 120) lists `docs/control/resume.jsonl` first
  and reads every listed file in one attempt; an instance with per-order
  segments and no legacy log makes the source unavailable, `orderIds()`
  throws (121 to 123) before the status command is spawned, and the
  fallback is skipped (155 to 157); `readControl`
  (`scripts/lib/control-store.mjs` line 113) reads the legacy log only when
  it exists and the configured roots. The fork observed
  `control:canonical-segments unavailable` and `resume:status--json
  unavailable` with eight closed orders.
- The loopback (`console-loopback.ts`) has two routes, `GET
  /console-commands-v1` and `POST /console-commands-v1/invoke`; `console
  board` is not a command id (`console-commands.ts` lines 9 to 67) and
  product 04 line 267 lists it outside the contract; `runtime-status-v1` is
  reachable only through `invoke console.status` under `shell.run`, which
  writes receipts per poll. Skeleton cannot import the console's collector
  (`packages/console/package.json` depends on skeleton), so a board route
  needs a child process or a snapshot. The fork's WO-007 mocks `GET /board`
  and its live view waits (FUP-280abd447f789958).
- `packages/console/README.md` line 3 says component `0.4.0` while
  `package.json` says `0.4.4`; the README's label rule (lines 229 to 231)
  keeps `runtime-status-v1` for additive growth, which is why no version
  bump followed the new field.

**Design (scope discipline):**

- *Coded reasons at one point.* `attempt()` maps the error to a coded
  reason and keeps the raw message out of the view model; store readers
  and the beacon parser follow; a board test asserts the absence of the
  root, the node binary and the home directory in every string. Rejected:
  rewriting paths in reasons (axis: substring matching misses realpath
  variants and child stderr); a schema pattern forbidding leading slashes
  (axis: `/console-commands-v1` is a legitimate string, and a stricter
  schema is a consumer-visible contract change).
- *Two files in the kit.* The schemas join `KIT_FILES.files` explicitly;
  the carried tests find them; product 04 and the README links resolve in
  an instance. Rejected: copying them into `dist` at build (axis: a second
  copy and a package-contract change).
- *The build is a no-op in a kit root.* `scripts/build.mjs` reports that
  the carried runtime is the build and exits 0 when `isKitRoot(root)`, so
  every build-first script works unchanged and core's script names stay
  identical to the kit's. Rejected: rewriting the kit's `package.json`
  scripts (axis: the documented identity of core's and the kit's script
  names and commands).
- *Read control the way `resume` does.* The legacy log is optional and
  the roots come from the configuration; the fold's cross-check stays.
  Rejected: importing `scripts/lib/control-store.mjs` from the console
  package (axis: layering; the console host reads files and runs the
  kit's CLIs).
- *Read routes serve files, the command route serves commands.* The
  status file is already atomic and path-free by contract; the board
  snapshot is the same shape, written by the resident through the console
  CLI as a child (no import cycle), refreshed on read when stale, bounded
  in time; both routes keep the origin, Host and token checks and run
  outside the command lane without receipts, because a read changes no
  state. Rejected: a `console.board` command id (axis: receipts and
  result bytes per poll, the `shell.run` envelope, the command lane
  blocking lifecycle commands); a console-owned second server (axis: two
  servers and two tokens for one browser).
- *UI state is the host's.* Product 04 states (the 2026-10-21 pass) that
  state an operator makes while using a console persists in a store the
  host owns, apart from control records, and that reading the console
  never writes a control record; this order adds no core store for it,
  because the contract is the boundary and the store is the instance's.
  Rejected: a kit directory for UI state (axis: no consumer has asked for
  one shape).

**Deliverables:** the coded reasons and the no-path test; the two kit
files; the kit-root build; the control reader; the two routes, the
snapshot and the client functions; the README and product 04 write-backs;
fixtures; decisions.

**Acceptance criteria (all required)**

1. Over a fixture launchpad with a missing requested store, a missing
   `docs/evidence/current.json`, a missing control log and a refused
   Beacon worktree, `board --json` parses, every unavailable source carries
   a coded reason, and a test asserts that no string anywhere in the JSON
   contains the fixture root, `process.execPath` or `os.homedir()`; the
   control that fails with only the `attempt()` change reverted is
   recorded.
2. In a fixture instance with `docs/control/orders/WO-NNN.jsonl` segments
   and no `docs/control/resume.jsonl`, `control:canonical-segments` and
   `resume:status--json` are available and the Work panel's orders section
   lists the orders; with a configured control root the same holds; in
   core (legacy log present) the WO-164 cross-check still refuses a fold
   that returns orders the log lacks.
3. A fixture export's `KIT-MANIFEST.json` lists
   `packages/console/uifa-board-v1.schema.json` and
   `packages/console/runtime-status-v1.schema.json`; the carried
   `dist/test/board.test.js` and `runtime-status.test.js` read them in the
   export; `npm run build` in the export prints its no-op line, exits 0
   and leaves `git status` unchanged; `npm run console -- board --json`
   exits 0 and prints a board.
4. On a resident with a bound store, `GET /runtime-status-v1` and `GET
   /uifa-board-v1` from `127.0.0.1` with the matching Host, a local Origin
   and the bearer token return the status file and a board snapshot that
   validates against its schema; a non-local Origin, a wrong Host, a
   missing or wrong token and a non-loopback socket are refused with the
   same codes the command route uses; neither read writes a receipt or an
   event; a read during a running invoke returns without waiting for the
   command lane; a snapshot older than its freshness bound is refreshed by
   one bounded child run and a fresh one is served as is; the client
   exposes `readRuntimeStatus` and `readBoard`.
5. `packages/console/README.md` names component `0.4.x` as `package.json`
   does at handoff and the application release the order's version line
   assigns, states the three names (UIFA v0, `uifa-board-v1`, console v1 as
   the Angular shell), the two read routes and the kit path of the
   schemas; product 04 §Console parity contract v1 names the two read
   routes beside the one command route and §Later console hosts names the
   board snapshot; `npm run meta -- --check` passes.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; the `uifa-board-v1` and `runtime-status-v1`
   labels unchanged; the re-mints of step 10 recorded.

**Preflight:** `npm test -- --only console` for steps 2, 3, 5 and 8;
`npm test -- --only skeleton` for steps 6 and 7; `npm test -- --only
launchpad` for steps 4 and 9; `npm test -- --only configuration-root` for
every script step; `npm test -- --only evidence-sources` and the edition
suites for step 10; `npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --` for the steps that edit their
declared sources; then one `npm test -- --review` (07-execution-guide.md
§Preflight before the full gate).

**Execution plan (the executor follows these steps in order; observed at `926b8234`, 2026-10-21):**

1. `docs/evidence/WO-225/README.md` (new): at the base, `board --json`
   over the fixture of criterion 1 with the strings that carry paths
   listed by source, the export's `npm run console` failure line, the
   instance-shaped collection's unavailable sources and the loopback's two
   routes, written before any change. Check: the README names the base
   behavior with the commands run.
2. `packages/console/src/collect.ts` (`attempt`, `storeFromLog`, the
   requested stores at 249 to 256) and `packages/console/src/builds.ts`
   (the loadout factory error at 55 to 59): coded reasons; `context.ts`
   unchanged. Check: `npm test -- --only console`.
3. `packages/console/src/text-sources.ts` (`parseConstellation`, 235 to
   240) and `work.ts` (205 to 230): the refused Beacon row's `age` cell
   carries the reason without the directory. Check: `npm test -- --only
   console`.
4. `scripts/launchpad.mjs` (`KIT_FILES.files`, 197 to 203): the two schema
   paths; the export README grouping (605 to 640) names them; `scripts/kit/README.client.md`
   lines 486 to 490 say the build-first scripts run in an export. Check:
   `npm test -- --only launchpad`.
5. `scripts/build.mjs` (the main block, 153 to 182): when
   `isKitRoot(repo)` (`packages/skeleton/src/runtime-inputs.mjs` line 84),
   print `carried runtime is the build; nothing to compile` and exit 0
   before `atomicBuild`; `recordBuildFreshness` untouched. Check: `npm test
   -- --only launchpad`; `npm test -- --only runner-fixtures`.
6. `packages/console/src/collect.ts` (`controlLog` 105 to 120, `orderIds`,
   the fold 134 to 171): the legacy log read only when present, the orders
   directory from the configured control root (`dotln.config.json`
   `roots.control`, default `docs/control`), the cross-check kept when
   both are available. Check: `npm test -- --only console`.
7. `packages/skeleton/src/resident-host.ts` (beside the status publication)
   and `packages/skeleton/src/console-loopback.ts` (`decode`, 447 to 462):
   the board snapshot `uifa-board-v1.json` written atomically into the
   store's `console/` directory by a bounded child run of
   `packages/console/dist/src/cli.js board --json` (timeout 60 s, the
   resident's node binary), refreshed when a read finds it older than 30 s
   or absent; `GET /runtime-status-v1` and `GET /uifa-board-v1` after the
   socket, Host, Origin and token checks and before the command lane,
   serving the file bytes with `Content-Type: application/json` and no
   receipt; `packages/console/src/console-client.ts` gains
   `readRuntimeStatus` and `readBoard`. Check: `npm test -- --only
   skeleton`; `npm test -- --only console`.
8. Fixtures for criteria 1 to 4 in `packages/console/test/board.test.ts`
   (the no-path assertion over the failure fixture), `collect.test.ts`
   (the segments-only instance, the configured root, the cross-check),
   `packages/skeleton/test/console-loopback.test.ts` (the two routes, the
   refusals, the freshness bound, no receipt, no lane wait) and
   `scripts/test-launchpad-export.mjs` (the manifest entries, the carried
   tests, the no-op build, `npm run console -- board --json`); each
   settled row paired with a control recorded in
   `docs/evidence/WO-225/controls.json`. Check: the Preflight suites.
9. `packages/console/README.md`: the header's component and application
   versions, the three names, §Live runtime status (the read routes), §Contract
   for another UI host (the kit path of the schemas, the coded reasons,
   the no-path rule). Check: `npm test -- --only console`.
10. Re-mints: point `docs/evidence/current.json` at WO-225 revision 001 for
    each kind `scripts/build.mjs` stales; `npm run build`; the
    deterministic re-mint commands of each stale edition;
    `node scripts/feedback-evidence.mjs --carry <the feedback edition
    selected at the base>`. Check: `npm test -- --only evidence-sources`
    and each stale edition's suite.
11. Write-backs, in place, each heading re-read at the base: product 04
    §"### Console parity contract v1" (the one-route paragraph at lines
    162 to 170: the two read routes beside it; the `console board` sentence
    at 266 to 268) and §"### Later console hosts" (the board snapshot and
    the status file as the shell's reads); `docs/evidence/WO-225/decisions.md`
    with one decision per step; `npm run meta`; `npm run
    publication:check`. Check: `npm run test:docs`.
12. Handoff: `npm run format`; `npm run test:docs`; `npm test -- --review`
    (declared machinery sources changed); complete
    `docs/evidence/WO-225/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the paired controls of step 8;
`npm run test:docs`; `npm test -- --review`. No live model run; the first
live browser read is the fork's console order against the carrying starter
release.

**Write-back duty:** criterion 5 and steps 9 and 11.

**Known issues and carry-ins:**

- FUP-280abd447f789958 (session and order status for a console, with a
  direction channel; the fork's D17) is allocated here for its read half:
  the status file and the board over the loopback. Its direction channel
  (commands) is the parity contract as it stands, and a request channel
  from the shell to core is WO-193's.
- WO-220's console rows edit the same package; whichever runs second
  rebases. WO-080's Workstreams section is an additive view-model change
  the snapshot carries unchanged.
- The snapshot's freshness bound (30 s) and child timeout (60 s) are the
  planner's first values; the executor records the measured collection
  time in the decisions and may change them with the reason.
- The fork's hand-scrubbed fixture (`tools/scripts/scrub-board-fixture.mjs`
  in its target) becomes unnecessary once the carrying release lands; the
  fork decides when to drop it.
- The `runtime-status-v1` field added without a version bump is by the
  README's rule (lines 229 to 231): additive growth keeps the label, and
  strict earlier decoders reject new unavailable views by design; this
  order restates the rule beside the read routes and changes no label.

**Non-goals:** a new command id; a second server; a UI-state store in the
kit; authentication beyond the loopback's token; remote or multi-device
access; a change to the `uifa-board-v1` or `runtime-status-v1` labels;
rendering the board anywhere but the instance's shell.

**Operator-review assumptions**

1. A browser shell runs on the same machine as the resident and reads the
   two routes with the token its local host supplies.
2. The board snapshot is a projection, never an authority; the shell treats
   it as it treats the status file.
3. The fork's console order consumes the carrying starter release and
   drops its mocks when it does.
