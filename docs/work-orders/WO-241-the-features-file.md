# WO-241 — The features file: `dotln.config.json` gains a `features` section an operator reads and edits by feature name, a registry in the kit says what each feature is, whose it is (core, instance or both), its default and where it is read, a generated `FEATURES.md` renders the instance's elections as a table, and the first two elections are wired through it (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** delivery
**Release classification:** minor. One additive configuration section
(absent means today's behavior), one registry, one command with a generated
document, one existing election rewired; no existing key moves. Assigned at
activation under the standing opt-out default.
**Cost:** adds `scripts/lib/features.mjs` (new: the registry of electable
features and `readFeatures(root)`), the `features` section in
`scripts/lib/config.mjs` (`SECTION_KEYS` and a validator in the shape of
`validateRelease`), `scripts/features.mjs` (new command `npm run features --
list|render|check`) with its `package.json` entry, the generated
`docs/control/FEATURES.md` rendered by `render` and refreshed by `npm run
meta`, a `features` block in `scripts/kit/dotln.config.example.json`, a
§Features section in the kit guide (`docs/KIT.md` after WO-245), the first two wired
elections (`tinkerer-economy`, read by the executor supports' default, and
`plan-first`, declared default off for WO-242 to consume), the
`private-destination` row with its one consumer (the kit's
`CLAUDE.template.md` §Secrets, emitted with the election), cases in
`scripts/test-configuration-root.mjs`, `scripts/test-launchpad.mjs` and the
suite that covers `npm run meta`. Removes: the absence of one page that
says, for every election wherever its key lives (`release.*` surface
toggles that nothing reads yet, `kit.applyInstanceActions`, `build.loadout`,
the budgets file's `null` switches, the compiled defaults), what it does,
whose it is, and whether anything reads it; the keys themselves stay where
they are, so the removal is the missing page and the hidden defaults, not
the four places.
Wall-clock: one small render per `npm run meta` (the executor measures it
and records it; unknown until measured, never assumed cheap). Context
bytes: this file, about 17,000. Commands: one new, `npm run features`.
Tokens: unknown until run. Steps: 9. Re-mints: `scripts/lib/config.mjs` is
a registered import sibling the editions deliberately exclude
(`scripts/lib/evidence-sources.mjs`), so no edition re-mint and no live
feedback episode unless the executor finds `features.mjs` registered at
activation; `package.json` is a common source, so the new entry re-mints
deterministically the editions it stales; declared machinery sources change,
so `npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's dispatch of 2026-10-30, item 2
("start a dotln config file ... easily human readable and understandable
about which features we're electing to use or turn off"), 2.a (an inventory,
progressive) and 2.b (operator-specific loadouts against core-specific), in
ignored intake `docs/intake/notes/planning-node24-features-config-plan-first-no-work-stream-2026-10-30.md`
(SHA-256 `94d4f4bd85efaf035a89353d6ad88abedf8e1d29c2c298fe1b3d69b62806bd8a`);
item 6's "config mode" is the first new election this file carries, consumed
by WO-242. Filed by the [2026-10-30 pass](../planning/node24-features-config-plan-first-no-work-stream-2026-10-30.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen: no
stop condition.
**Depends on:** WO-069 (closed: the one configuration loader every command
resolves through); WO-150 (closed: the Tinkerer economy equipped by default
with its opt-out, the first existing election this order rewires); WO-218
(closed: `dotln.config.json` shipped in core with `historicalWorkOrders`
and `contributions`, the file this section joins).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-069",
    "relation": "satisfied-by-close",
    "reason": "the configuration loader and its positive validation the features section extends"
  },
  {
    "workOrderId": "WO-150",
    "relation": "satisfied-by-close",
    "reason": "the Tinkerer economy default and opt-out this order reads through the features section"
  },
  {
    "workOrderId": "WO-218",
    "relation": "satisfied-by-close",
    "reason": "core's own dotln.config.json, the file the section is added to"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/config.mjs` (`CONFIG_FILENAME`
and `CONFIG_SCHEMA_VERSION` at 17 and 18; `SECTION_KEYS` at 101 to 113;
`BUILD_KEYS` at 67 and `RELEASE_KEYS` at 69 to 72; `validateBuild` at 326,
`validateRelease` at 352, `validateKit` at 378; the defaults at 1011 to
1013); `scripts/kit/dotln.config.example.json` (the kit's example: `version`,
`roots`, `derivedOrders`, `repositories`, `build`, `release.displayName`);
`docs/control/budgets.json` (`subagentCap`, `dispatches.*` with `null`
meaning no bound, `retention` with `null` meaning keep);
`packages/skeleton/src/loadouts/executor-supports.ts` (5 and 89:
`tinkerer-economy` equipped by default) and `scripts/lib/executor-readiness.mjs`
16; `scripts/test-configuration-root.mjs` 259 to 262 (the only readers of
`release.readmeBlock`, `componentVersions`, `corpus`, `publicationCheck`
today are tests); product 07 §Where the control plane finds its documents
(the `dotln.config.json` paragraph: "Version 1 validates and exposes these
sections; the orders that own `build` and `release` consume them");
`.claude/harness-manifest.json` (`loadoutId: contributor`; the profiles and
grants); `scripts/kit/README.client.md` lines 19, 209, 381, 402 and 589
(every place the README names `dotln.config.json`); `scripts/meta.mjs` (the
regeneration `npm run meta` runs; the generated check of `npm run test:docs`).

**Objective:** An operator opens one file and sees, by name, every feature
their instance elects or declines, with a note of their own beside a choice
when they want one; a generated page beside it says in a sentence what each
feature does, whether it is core's, an instance's or both, what the default
is, which key carries the election and which module reads it, and marks a
switch nothing reads yet as unread rather than pretending. Turning a feature
off is one edit; a misspelled feature refuses with the list of real ones.
The inventory grows with later orders by adding a registry row, never by a
second file.

**Observed gap (dated 2026-10-30 at `main` `4090d70d`):**

- `dotln.config.json` validates eleven sections (`SECTION_KEYS`, 101 to
  113) and refuses unknown keys. Four boolean surface toggles exist under
  `release` (`readmeBlock`, `componentVersions`, `corpus`,
  `publicationCheck`; 69 to 72) and are read by no script outside the
  configuration-root test (a search of `scripts/` and `scripts/lib/` on
  2026-10-30 found only `test-configuration-root.mjs` 259 to 262 and a
  launchpad-update field name); product 07 says the owning orders consume
  them. `kit.applyInstanceActions` (378 to 387) is read by the update.
  `build.loadout`, `profile` and `overlay` are selections, not elections.
- Elections also live in the budgets file as `null` (`subagentCap`, the
  dispatch bounds, the retention classes) and in compiled defaults: the
  Tinkerer economy support is equipped by default
  (`executor-supports.ts` 89, WO-150) and its opt-out is wherever WO-150
  left it, not in a file an operator reads.
- The kit's example configuration shows `roots`, `derivedOrders`,
  `repositories`, `build` and `release.displayName`; nothing in the
  example or the kit README lists what an instance can turn off.
- The compiled loadout is `contributor` for core and `target-worker-*` for
  target sessions (`.claude/harness-manifest.json`); the operator's words
  "operator-specific loadouts vs core-specific" name the distinction the
  registry has to carry: a feature core runs on itself (the starter
  refresh, publication editions, the Entropy Reducer over the launchpad,
  reader scoring) against one an instance elects (the Tinkerer economy,
  plan-first mode, independent reviews per execution), with some both.
- No document says which features are not electable: the six refusals,
  the writer reservation and the clean-room floor are not switches, and a
  reader today cannot tell that from the files.

**Design (scope discipline):**

- **One configuration file, one new section.** `features` joins
  `dotln.config.json` beside the existing sections; its absence means
  today's behavior byte for byte, as every other section's absence does.
  Each entry is `"<feature-id>": true | false` or `"<feature-id>": { "on":
  boolean, "note": "<the operator's reason>" }`; unknown ids refuse naming
  the id and `npm run features -- list`. Rejected: a second file (a
  Markdown document with a marker block, a YAML or TOML file) (axis: one
  configuration source every loader already resolves, against readability
  without tooling; the runtime has no YAML or TOML parser and a JSON file of
  named booleans with optional notes is readable). Rejected: JSON with
  comments (axis: every reader of `dotln.config.json` would need the
  stripper; the `note` field carries the operator's reasons instead).
- **The registry is the single description.** `scripts/lib/features.mjs`
  declares each feature once: `id`, `scope` (`core`, `instance`, `both`),
  `default`, `what` (one sentence for the reader), `readFrom` (the key that
  carries the election: `features.<id>` for new ones, an existing key such
  as `kit.applyInstanceActions` or `budgets.subagentCap` for the ones that
  already exist) and `readBy` (the module that consumes it, or `unread`).
  `readFeatures(root)` resolves the file over the defaults. Rejected: moving
  the existing keys into `features` (axis: compatibility with every
  instance's file against a uniform shape; the registry points at the key
  wherever it lives, so the table is complete without a migration).
- **The readable page is generated.** `npm run features -- render` writes
  `docs/control/FEATURES.md`, a table of every registry row with the
  instance's effective value and its source (default or the file), marked
  `unread` where `readBy` is `unread`; `--check` refuses a stale page; `npm
  run meta` renders it and the document gate's generated check reads it.
  Rejected: hand-maintaining the table (axis: a generated document never
  drifts from the registry; WO-238's kinds contract names generated
  documents as a kind).
- **Two elections prove the wiring.** `tinkerer-economy` (scope instance,
  default on) is read through `readFeatures` by the executor supports'
  default, with WO-150's existing opt-out route mapped onto the same key
  and the old route admitted for one release with an advisory if it was
  documented; `plan-first` (scope instance, default off) is declared and
  read by nothing until WO-242, so its row says `readBy: WO-242` and the
  check admits a declared consumer that is a queued order id. Rejected:
  wiring the `release.*` toggles now (axis: nothing reads them; they are
  listed as `unread` so the table tells the truth, and the order that
  consumes them wires them).
- **A private instance's own floor.** The kit's `CLAUDE.template.md`
  §Clean Room is owner-relative (never import what the owner has no right to
  publish), but its §Secrets tells every instance's agent never to expose,
  copy, commit or print private hostnames or account identifiers, so an
  instance the operator runs privately would still be told to keep its own
  tracker links out of its own documents. The `private-destination` election
  (scope instance, default off) records that ordinary project links and
  identifiers of the instance's own organisation are admitted inside that
  instance's repository; credentials stay excluded everywhere, publication
  screens keep refusing private terms in anything that leaves the
  instance, and core's floor is unchanged. The one consumer is the emitted
  §Secrets paragraph of the instance's `CLAUDE.md`, which names the
  admission when the election is on and is byte-identical to today when it
  is off. Rejected: repository visibility as permission (axis: a forge
  setting is not a recorded authority). Rejected: a `cleanRoom: false`
  switch (axis: the floor is not electable; only the destination of
  ordinary links is). This bullet adopts the other pass of 2026-10-30's
  destination-policy finding on the operator's direction.
- **Not electable is said.** The registry's rendering ends with the fixed
  list the file cannot change: the six refusals, the writer reservation,
  the clean-room floor, with the sentence that they are the floor. Rejected:
  leaving them out (axis: the operator's question "what can we turn off"
  is answered by what cannot be as much as by what can).
- **Live-run surfaces at the base.** The loader and its positive
  validation: exist. The example configuration and the README: exist. A
  registry: absent. A generated page: absent. The Tinkerer opt-out: exists
  in the form WO-150 left (the executor reads it at activation and records
  the form).

**Execution plan (the executor follows these steps in order; observed at `4090d70d`, 2026-10-30):**

1. `scripts/lib/features.mjs` (new): the registry rows (at least:
   `tinkerer-economy`, `plan-first`, `kit-instance-actions` reading
   `kit.applyInstanceActions`, `release-readme-block`,
   `release-component-versions`, `release-corpus`,
   `release-publication-check` reading their `release.*` keys and marked
   `unread`, `subagent-cap` reading `budgets.subagentCap`, `dispatch-bounds`
   reading `budgets.dispatches`, each with scope, default, `what`,
   `readFrom`, `readBy`), the not-electable list, and `readFeatures(root)`;
   the first rows transcribe the table of `docs/product/feature-configuration.md`,
   the inventory the 2026-10-30 pass wrote, which then links the generated
   page for an instance's effective values instead of repeating them.
   Check: a new case file the executor names in `scripts/test-runner.mjs`
   under the suite that declares `scripts/lib/config.mjs`
   (`configuration-root`), spelled in the Preflight line.
2. `scripts/lib/config.mjs`: `SECTION_KEYS` gains `features`; a validator
   in `validateRelease`'s shape admits booleans or `{ on, note }` for known
   ids and refuses unknown ids naming the id and the list command; the
   defaults object gains `features: {}`. Check: `npm test -- --only
   configuration-root` (the absent-section case stays byte-identical).
3. `scripts/features.mjs` (new) and the `package.json` entry `features`:
   `list` prints the effective table as JSON and as text; `render` writes
   `docs/control/FEATURES.md` through the generated-document convention
   `scripts/meta.mjs` uses; `check` refuses a stale page. `scripts/meta.mjs`
   calls `render`; the generated check of `npm run test:docs` reads the
   page. Check: the suite that covers `npm run meta` (`meta`); `npm run
   test:docs`.
4. `packages/skeleton/src/loadouts/executor-supports.ts` (5 and 89) and
   `scripts/lib/executor-readiness.mjs` (16): the Tinkerer economy's
   equipped default reads `features.tinkerer-economy` at emit, so an
   instance that sets it `false` emits an executor root without the
   support; the existing opt-out route (as WO-150 built it) maps onto the
   same key. Check: `npm test -- --only harness` (the emitted root with the
   election off and on); `npm test -- --only harness-context` (cold-start
   bounds unchanged).
5. `scripts/kit/dotln.config.example.json`: a `features` block showing the
   instance-scope rows at their defaults, one in the `{ on, note }` form.
   `scripts/kit/CLAUDE.template.md` §Secrets: the sentence the
   `private-destination` election adds when on, emitted through `harness
   emit`'s existing template read; off, the paragraph is byte-identical to
   today. Check: `npm test -- --only launchpad` (the export carries the
   example); `npm test -- --only harness` (the emitted floor with the
   election on and off).
6. The kit guide (`docs/KIT.md` once WO-245 merges, otherwise
   `scripts/kit/README.client.md`) §Features (new, after §First steps item
   5's configuration sentence): the file, the two entry forms, the
   command, the generated page and the not-electable list. Check: `npm
   test -- --only launchpad`; `npm run publication:check`.
7. `docs/control/FEATURES.md`: rendered for core by `npm run features --
   render`; core's own `dotln.config.json` elects nothing (its defaults
   stand), so the page shows every default with source `default`. Check:
   `npm run features -- check`.
8. Write-backs: product 07 §Where the control plane finds its documents
   (the `dotln.config.json` paragraph: the `features` section, the two
   forms, the registry, the generated page, the measured render cost);
   `docs/evidence/WO-241/decisions.md` (the registry's first rows and why
   each existing switch is `unread` or read; the render's measured cost
   before and after in `npm run meta`); re-mint the editions
   `package.json`'s new entry stales; `npm run meta`; `node
   scripts/lineage.mjs index --check`.
9. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-241/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the registry and `readFeatures`; the `features` section
with its validator; the command and the generated page; the Tinkerer
election rewired; the example configuration and README section; the
write-backs and the measured render cost.

**Acceptance criteria (all required)**

1. A `dotln.config.json` with no `features` section loads with every
   feature at its registry default and every other section unchanged (the
   absent-configuration case of `configuration-root` stays byte-identical);
   a `features` entry of `true`, `false` or `{ "on": false, "note": "..." }`
   for a known id loads; an unknown id refuses naming the id and `npm run
   features -- list`; a non-boolean `on` or a non-string `note` refuses
   naming the key; an entry for a row whose `readFrom` is an existing
   configuration or budgets key refuses naming that key, so no election
   loads as a silent no-op; a retired or renamed registry id loads with an
   advisory naming its successor for one kit release before it refuses.
2. Every registry row carries `id`, `scope` in `core|instance|both`,
   `default`, a non-empty `what`, `readFrom` naming `features.<id>` or an
   existing configuration or budgets key, and `readBy` naming a module in
   the tree, `unread`, or a queued `WO-NNN`; the check judges a row's reader
   by toggling the row in a fixture and observing a changed output, never
   by a text match, and reports a row whose `WO-NNN` has closed as an
   advisory `npm run features -- check` prints and the next planning pass
   reads, never as a refusal in another order's gate; the first rows include
   at least `tinkerer-economy`, `plan-first`, `private-destination` and the
   four `release.*` surfaces marked `unread`.
3. `npm run features -- render` writes `docs/control/FEATURES.md` as a
   table with one row per registry entry (effective value, source `default`
   or `dotln.config.json`, scope, `what`, where read) and the not-electable
   list; `npm run features -- check` refuses a stale page and passes a
   fresh one; `npm run meta` renders it; `npm run test:docs` reads it
   through the generated check.
4. An instance fixture with `"tinkerer-economy": false` emits an executor
   root without the Tinkerer economy support and with every cold-start
   ceiling still met; with the key absent the root is byte-identical to the
   base's; `harness check` passes in both. An instance fixture with
   `"private-destination": true` emits a `CLAUDE.md` §Secrets that admits
   ordinary project links inside the instance while the publication screens
   still refuse a private term in a pull-request body fixture; with the key
   absent the paragraph is byte-identical to today's.
5. The kit's example configuration shows the instance-scope rows and one
   `{ on, note }` entry; an export carries it and the kit guide's
   §Features; `npm run publication:check` is green.
6. Product 07 §Where the control plane finds its documents names the
   section, the forms, the registry and the page; the decisions record the
   render's measured cost in `npm run meta` before and after.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only configuration-root` for steps 1 and 2;
`npm test -- --only meta` for step 3; `npm test -- --only harness` and `npm
test -- --only harness-context` for step 4; `npm test -- --only launchpad`
for steps 5 and 6; `npm run test:docs` when a document changes; each under
`node scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases of criteria 1 to 5; the deterministic re-mint
of each edition the `package.json` entry stales; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete
row at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criterion 6.

**Known issues and carry-ins:**

- Carry-in (FUP-edefd92233980b63): kit text that encodes a core-operator
  decision is marked as such where the registry row's `scope` says `core`,
  so an instance knows what it may decline; the first marks ride the rows
  this order writes (reopen: a fork true-forks a role or product 07 to
  decline a core-operator rule the marks did not name).
- The four `release.*` surface toggles are declared and unread today; this
  order lists them as `unread` and wires none (reopen: an order consumes
  one, which then changes its row to the consuming module).
- A feature an instance turns off that core's own gate assumes on is a
  question the registry's `scope` answers in words only; nothing refuses a
  core-scope election in an instance file beyond the registry's row (reopen:
  an instance elects a core-scope feature and a gate fails on it).
- The budgets file's `null` switches stay where they are and are listed by
  reference (reopen: the operator asks that bounds move into the features
  section).
- `plan-first` is declared here and consumed by WO-242; until WO-242 lands
  the row's `readBy` names the order and the election has no effect (reopen:
  WO-242 closes, which changes the row to its consuming module).

**Non-goals:** moving any existing key; a configuration UI; YAML, TOML or
commented JSON; wiring the `release.*` toggles; changing the budgets file's
shape; electing anything the floor forbids (the six refusals, the writer
reservation, the clean-room floor).

**Operator-review assumptions:** that "easily human readable" is met by a
JSON section of named booleans with optional notes beside a generated page
that explains each name, rather than by a new file format; that
"operator-specific vs core-specific" is the registry's `scope` field; that
the Tinkerer economy is the right first existing election to rewire because
WO-150 made it default-on with an opt-out the file should show; and that
the inventory's first rows are a start the operator extends by later
orders, as item 2.a says.
