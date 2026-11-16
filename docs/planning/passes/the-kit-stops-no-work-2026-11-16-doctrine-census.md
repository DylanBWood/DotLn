# Census: the author's doctrine and the platform, as shipped to an instance

Record of the [2026-11-16 planning pass](the-kit-stops-no-work-2026-11-16.md): a research worker's
report on the author's rules and the platform as an instance receives them, kept as the worker returned it, except that quotation marks were taken
off the passages that name the operator beside a quoted phrase, which the
document gate reads as quoting the operator. It is
that worker's reading of the tree at `38c333ab2`, not the pass's judgment;
the pass's document says which of its statements the pass checked and what
it decided from them. A statement it marks unverified is unverified.

Research worker report for the planning pass on branch
`planning/2026-11-16-the-kit-stops-no-work`, at HEAD `38c333ab2`, 2026-11-16.
Read-only: nothing in the repository or Git was written. Nothing under
`docs/control/local/` or `docs/intake/` was read. No test or gate was run.

Every claim cites file:line in this checkout. "Inference" marks a conclusion
drawn from cited code rather than read directly. "Unverified" marks a claim
I did not confirm by reading code.

---

## 0. Answer in one paragraph

The project wrote the platform/doctrine split down on 2026-09-03 (ADR-0006,
Principle 18, product 03's boundary table) and promised to start it "in
documentation and capability declarations". The documentation half exists,
but only in core documents an instance does not receive. The capability half
stopped at the WO-076 build overlay (2026-10-12), which can switch ten
optional *supports* and nothing else. In every instance:

- the author's ten feedback units are compiled in unconditionally;
- 34 shared role rules and every role procedure ship as fixed compiled text;
- the nine refusals ship the same way;
- the kit's own feature page calls the Clean Room floor "not electable",
  although ADR-0006 Decision 6 says Clean Room is repository governance and
  not a platform rule.

Three times a planning record narrowed the operator's request to a smaller
proxy:

- 2026-10-07: "unequip units" was read as the existing support switches.
- 2026-10-30: operator-specific loadouts vs core-specific was read as a
  feature-registry `scope` field.
- 2026-11-03: the carry-in to mark core-operator decisions in kit text
  closed as that same `scope` field.

The two follow-ups that would reopen the work are parked behind conditions
nothing is scheduled to meet:

- FUP-0082 (the owner-sovereign profile) waits for "a second owner".
- FUP-edefd92233980b63 (marked core-operator rules) waits for a fork to
  true-fork a skill, or for WO-207 and WO-096 to close. Both are "Not now".

---

## 1. What an exported instance receives

### 1.1 The mechanism

- `scripts/launchpad.mjs` `export` builds the kit from Git blobs at HEAD
  (`scripts/launchpad.mjs:1-12`, `readKitSources` at `:403`, `prepareKit` at
  `:1073-1342`).
- Kit files are listed in `KIT-MANIFEST.json` with SHA-256. Instance seeds
  are written once and never listed (`scripts/launchpad.mjs:1-12`,
  `:1137-1149`).
- The allowlist is `KIT_FILES` (`scripts/launchpad.mjs:274-319`).

### 1.2 Kit files: replaced by updates, hash-verified

| What | Source |
| --- | --- |
| All of `scripts/**`, including the templates in `scripts/kit/`, minus ten core-only fixtures and tests | `KIT_FILES.trees`, `.excluded` (`scripts/launchpad.mjs:275, 290-302`) |
| `packages/beacons/**` and the kernel, compiler and skeleton fixture trees | `scripts/launchpad.mjs:144-148, 275` |
| 19 build-free `.mjs` modules under `packages/*/src`, including `worker-catalog.mjs` and `worker-models.mjs` | `BUILD_FREE_MODULES` (`scripts/launchpad.mjs:240-271`) |
| The compiled runtime `packages/{kernel,compiler,skeleton,console}/dist/{src,test}` plus each `package.json`. TypeScript source is never a kit file. | `scripts/launchpad.mjs:134-143, 242, 1147-1148` |
| Derived `package.json` and `package-lock.json`, `dotln.config.example.json`, `UPSTREAM.md`, license files, `THIRD_PARTY_NOTICES` | `scripts/launchpad.mjs:1149-1153, 1294` |
| Kit documents: `docs/PLAYBOOK.md`, `docs/KIT.md`, `docs/OPERATOR.md`, product 07, `operator-reference.md`, product 08, the publication implementation-overlay template, the release tag-manifest template | `KIT_FILES.documents` (`scripts/launchpad.mjs:305-318`) |
| The emitted harness bundle: every surface except `CLAUDE.md`, listed at the bytes the export's own emit must reproduce | `scripts/launchpad.mjs:1162-1176` |

Hosts in the bundle:

- Claude Code only by default. The export predicts with
  `hosts = freshHostFeatures()` (`scripts/launchpad.mjs:1077`).
- Codex and Copilot surfaces are added only where `features.host-*` is
  elected or inferred (`scripts/lib/harness.mjs:155-162`; `docs/KIT.md`
  §Host support, `:1027-1057`).

Generated Claude surfaces a fresh instance gets (the Claude subset of
`.claude/harness-manifest.json` `installed`, read in core):

- `.claude/settings.json`
- 12 hooks: `agent-finished`, `commit-msg`,
  `concurrent-work-requires-worktrees`, `failure-observer`, `finish`,
  `no-attribution`, `no-lint-type-disables-as-fixes`, `permission-denied`,
  `permissions`, `read-observer`, `session`, `write-observer`
- 7 skills: `dotln-executor`, `-planner`, `-refuter`, `-release-close`,
  `-reviewer`, `-router`, `-verifier`
- 5 agents: `dotln-executor`, `-release-close`, `-reviewer`, `-verifier`,
  `-worker`
- `.claude/harness-manifest.json`, plus the generated block inside
  `CLAUDE.md`

### 1.3 Instance seeds: written once, never in the manifest

The list is `exportSeedPaths` (`scripts/lib/starter-seeds.mjs:72-111`); the
writes are at `scripts/launchpad.mjs:1178-1271`.

- **Configuration.** `dotln.config.json` holds only
  `{version: 1, release: {displayName: "DotLn-Enterprise-Starter"}}`
  (`scripts/lib/starter-seeds.mjs:125-126`).
- **Front pages.**
  - `README.md` comes from `scripts/kit/README.client.md`, a 17-line page
    that says "Replace this page with your own introduction"
    (`scripts/kit/README.client.md:16`).
  - `.gitignore` and `.gitattributes`.
- **Operating contract.**
  - `CLAUDE.md` comes from `scripts/kit/CLAUDE.template.md`.
  - `AGENTS.md` is a symlink to it.
  - `AI-HARNESS-SECURITY.md`.
  - `FOR-CORE.md`.
- **Root READMEs and the documentation map.**
  - READMEs for workstreams, repositories and the eleven seeded roots
    (`SEEDED_ROOTS`, `scripts/launchpad.mjs:342-366`).
  - The docs map `docs/README.md`.
- **First order and planning records.**
  - `docs/work-orders/WO-001-environment-truth.md`.
  - `docs/planning/sequence.md`, holding WO-001 only.
  - `docs/planning/followups.json`, empty.
- **Control records.**
  - `docs/control/doc-baseline.json`.
  - `docs/control/budgets.json`, from `scripts/kit/budgets.template.json`.
- **Lineage.** An empty idea ledger and its index.
- **Authority data.** `packages/skeleton/loadouts/grants.json`, which is
  `[]` (`scripts/launchpad.mjs:1261-1263`).

### 1.4 What stays in core

These are not in `KIT_FILES` and not seeded, so an instance never receives
them:

- **Package source.** All TypeScript under `packages/*/src`, including the
  loadouts that define the doctrine (`packages/skeleton/src/loadouts/*.ts`),
  and `packages/browser-evidence`.
- **Product documents** other than 07, 08 and `operator-reference.md`,
  including:
  - `01-principles.md`, which carries the platform/personal layer labels;
  - `03-architecture.md`, with the platform-and-instance boundary table;
  - `feature-configuration.md`.
- **Core's records.** `docs/decisions/` (ADR-0006 among them), the idea
  ledger's history, and core's work orders, evidence, verifications, final
  reviews, planning and control records.
- **Core's own hand-written `CLAUDE.md`** and core's `dotln.config.json`.
- **Most of `corpus/`.**
- **The 41 suites** listed in `docs/KIT.md` §Suites that stay core-only
  (`docs/KIT.md:2250-2307`).

`UPSTREAM.md` carries ADR-0006 only as a pointer to core's commit, described
as "the platform and instance boundary this kit makes physical"
(`scripts/launchpad.mjs:695-703`).

### 1.5 What an instance's owner is told

**`docs/KIT.md` (a kit file)**

- "The Contributor build is starter content, not kit law. The instance owns
  its build through a JSON overlay" (`docs/KIT.md:1086-1089`).
- The overlay's `equip` and `unequip` take only nine support ids, and:
  - "These switches do not define new units or remove the locked floor"
    (`:1125-1135`);
  - Tinkerer economy is elected through `features.tinkerer-economy` instead
    (`:1133-1135`).
- "The generated harness contract's refusal classes, the single-writer
  reservation and the clean-room floor are not electable. They are the
  floor" (`:1006-1009`).
- "Core rows describe core's choices, not a rule this instance must adopt"
  (`:1075`).
- Kit files versus instance files (`:2569-2643`):
  - the `.claude/` bundle is a kit file a re-emit rewrites (`:2603-2605`,
    `:2650`);
  - `CLAUDE.md` is an instance file whose generated block is checked
    (`:2629-2632`).
- "Editing a kit file is choosing the true-fork path" (`:3606-3622`).
- Where extensions go (`:3129-3138`):
  - standing rules go in `CLAUDE.md` outside the generated block;
  - skills and agents go under names that do not begin `dotln-`.

**`docs/OPERATOR.md` (116 lines)**

It says nothing about doctrine, overlays or which rules are optional. It
mentions elections only for hosts (`docs/OPERATOR.md:9`).

**`README.client.md`** says nothing about doctrine.

**The `CLAUDE.md` template** tells the owner to:

- treat Clean Room as a "locked floor" (`scripts/kit/CLAUDE.template.md:10`);
- "edit it here" (`:3-5`).

---

## 2. The author's doctrine as shipped

### 2.1 Where the rules and the loadout are defined

**The loadout**

- `contributorLoadout`, `loadoutId: "contributor"`, is defined at
  `packages/skeleton/src/loadouts/contributor.ts:562-716`.
- Its single active mechanic is `clean-room`. Its invariant is "Employer
  separation and secret exclusion are the locked Clean Room floor"
  (`:575-577`, `:601-640`).
- The single permission support, `contributor.permissions`, denies ssh, scp,
  sftp and npm publish (`:491-522`, `:642-683`).

**The ten feedback units**

- They are the `retainedFeedbackUnitsV1` and `personalFeedbackUnits` arrays
  (`packages/skeleton/src/loadouts/feedback.ts:61-166`, `:187-263`).
- Each carries `scope: ["personal-profile", "equipped-feedback-host"]`
  (`feedback.ts:29`). A grep shows that field is only normalized
  (`packages/compiler/src/feedback.ts:159`) and never read by the lowering
  (inference from the grep).
- Hook kinds are set at `feedback.ts:52-58`. Prose-only and Stop-only
  handlers are set at `:168-178`.

**Supports**

- Executor supports and their defaults:
  `packages/skeleton/src/loadouts/executor-supports.ts:74-93`.
- Shared supports:
  - `process-cost` (`process-cost.ts:4-7`);
  - `goal-alignment` (`goal-alignment.ts:3-7`).
- Switches: `contributorConfiguredProgram` (`contributor.ts:1323-1343`).

**Shared role rules**

- 34 records of `{id, roles, text}` (`contributor.ts:134-138`):
  - `correctionRules` (15, `:152-216`);
  - `insertedRules` (17, `:777-847`);
  - `operator-controls`;
  - `session-boundaries` (`:849-860`).
- The ids: worker-launch, worker-no-print, bounded-probes, own-decisions,
  operator-aim, operator-words, question-pathways, claims-evidence,
  request-authority, blocked-turn, prune-own, runnable-commands,
  stale-gate-rows, stop-monitors, safeguard-refusals, browser-verification,
  session-commands, quality-pass, artifact-shape, document-kinds,
  expected-data, durations, dispatch-bounds, off-ramps, amend-order,
  fan-out, session-readback, publication-check, area-notes,
  initiative-layout, standing-file, operator-controls, session-boundaries.

**Role procedures**

- `common` (`:237-251`): resolve cwd; status; "Never guess"; Read
  directives; "No branch commits before final review" (`:247`); the
  decision-write rule.
- `actor` (`:253`), `evidence` (`:255-258`), `productGate` (`:259`),
  `costLine` (`:261`), `boardedDefect` (`:263`).
- Router (`:273-…`) and the release close's own list (`:880-893`).
- Executor, verifier and reviewer numbered steps (`roleSteps`, `:923-958`).
- `planFirstSteps` (`:918-922`).
- The review briefs and rules (`:86-104`).

**The nine refusals**

- `HARNESS_REFUSALS` (`packages/compiler/src/harness.ts:1762-1818`).
- The sentence printed into `CLAUDE.md` is `HARNESS_BOUNDARIES` (`:1820`).
- The hooks that enforce them live in
  `packages/skeleton/src/harness-host.ts`. The planning fence is at
  `:6030-6056`.

### 2.2 How the skills are emitted

1. `scripts/harness.mjs emit` reads the overlay, the features, the workers
   and the settings fragment from the launchpad (`scripts/harness.mjs:430-445`).
2. It calls `harnessInstallation` (`scripts/lib/harness.mjs:163-…`), which:
   - turns overlay `unequip`/`equip` into support switches (`:211-213`);
   - passes `desktopControl` and `planFirst` from the features (`:235-236`);
   - always compiles the feedback units with
     `const feedback = options.feedback ?? personalFeedback();` (`:246`).
     No configuration path sets `options.feedback`: `scripts/harness.mjs`
     passes none (`:430-445`).
3. `lowerToHarness` (`packages/compiler/src/harness.ts:964-…`) writes each
   `SKILL.md` in this order (`:1543-1563`):
   - the `<!-- Origin: {ids, loadoutId, semanticHash} -->` comment;
   - the role procedure;
   - one line `${unitId}: ${desiredBehavior}` per feedback unit the role
     equips (`:1561`).
4. Every role equips all ten units: `feedbackHandlers: handlers` with
   `handlers = personalFeedbackUnits.map(unit => unit.trigger)`
   (`contributor.ts:82`, `:280`, `:308`, `:335`, `:361`, `:391`, `:412`,
   `:438`).
5. Hooks are emitted for non-prose units (`harness.ts:1226-1275`;
   `hookFor` at `:784-792`). Prose units are skipped (`:1227`).

### 2.3 Rule by rule

"Same text?" means the instance's emitted text compared with core's emitted
text. Both come from one compiled runtime, so they are byte-identical unless
an election changes them (inference from 2.2).

**Five facts every row of the next table shares:**

- **Same text.** Yes, in every instance.
- **Remove or replace.** No. The overlay's `equip` and `unequip` reject any
  id outside the support switches: `names unknown support`
  (`scripts/lib/build-overlay.mjs:84-89`; `docs/KIT.md:1125-1132`). The only
  removal is `build: "none"`, which drops the whole bundle
  (`scripts/lib/harness.mjs:195-210`).
- **Add.** Yes, as hand-written text in `CLAUDE.md`.
- **A hand edit to a `SKILL.md` or hook file:**
  - `harness check` fails with `harness drift: <path>`
    (`scripts/lib/harness.mjs:1121-1126`);
  - the next emit overwrites it;
  - `launchpad update` refuses the file as "locally modified" while the
    instance's check fails (`scripts/launchpad.mjs:1858-1881`).
- **A hand edit to compiled `dist/`** is refused outright: "kit runtime
  differs from the manifest" (`scripts/launchpad.mjs:1633`).

**The ten feedback units (`feedback.ts`)**

| Unit | Mechanism in an instance |
| --- | --- |
| anti-oscillation | Prose, advisory, role text only (`feedback.ts:168-173, 249-257`) |
| bounded-boy-scout-cleanup | Prose, advisory, role text |
| correctness-over-sycophancy | Prose, advisory, role text |
| fail-conservative-correction | Prose. Its typed-correction hook is unrealized: `correctionToken: null` (`contributor.ts:1320`) |
| concurrent-work-requires-worktrees | Hard. A PreToolUse hook, and also refusal row `writer` |
| no-attribution | Hard. PreToolUse hook, `commit-msg` hook, the emitted `attribution` settings (`feedback.ts:277-280`; `.claude/settings.json`) and the publish helper (`scripts/lib/launchpad-publish.mjs:11`) |
| no-lint-type-disables-as-fixes | Hard. A PostToolUse hook on writes |
| verify-app-before-done | Advisory at Stop (`finish.mjs`) |
| read-your-own-output | Advisory at Stop. The read-observer journals reads |
| no-partial-completion | Advisory at Stop |

Two notes on these units:

- Their `scope` says `personal-profile`, but nothing reads it.
- `lifecycleFeedback()` (`feedback.ts:268-274`) is defined and imported by
  nothing: a grep of `packages/` and `scripts/` outside `dist` finds only
  its definition. The lifecycle's hard completion checks are separate code
  in `scripts/resume.mjs` and `scripts/lib/handoff-ledger.mjs`.

**Supports and other rule blocks**

| Rule or block | Same text? | Remove, replace or add, and by editing what | Does an update overwrite the edit? |
| --- | --- | --- | --- |
| Executor supports: adjacent-repair, decision-receipts, follow-up-queue, operator-check-in, communication-intent (on); communication-observation, communication-recommendation (off) | Yes at defaults | Remove or add: yes, through `build.overlay` `unequip`/`equip` (`docs/KIT.md:1125-1131`). Replace: no. | No. The overlay is an instance file outside the manifest (`docs/KIT.md:1092-1093`). |
| tinkerer-economy (on) | Yes at default | Yes, through `features.tinkerer-economy`; an overlay naming it refuses (`scripts/lib/harness.mjs:214-228`) | No. The configuration is an instance file. |
| process-cost, goal-alignment (on, every role) | Yes at defaults | Remove: yes, through the overlay (`contributor.ts:1323-1343`) | No |
| The 34 shared role rules | Yes | Remove or replace: no. Add: through `CLAUDE.md`. | A hand edit is refused, then overwritten (as above) |
| Role procedures: `common`, `actor`, `evidence`, `productGate`, `costLine`, `boardedDefect`, `roleSteps`, router, release close, planner, refuter, `targetOrderProcedure` | Yes | No. The exception is plan-first, below. | As above |
| plan-first steps (executor) | Absent by default | Inserted when `features.plan-first` is true (`contributor.ts:1252-1264`; `scripts/lib/harness.mjs:236`) | No |
| The Clean Room mechanic and its residue line, "the hand-written Clean Room floor stays locked" | Yes | Only through `build: "none"` (`contributor.ts:1314-1318`, `:601-640`) | Emit regenerates it |
| Permission denials (ssh, scp, sftp, npm publish) | Yes | Overlay `grants` remove an exact denial (`docs/KIT.md:1146-1153`; `contributor.ts:1265-1272` filters matchers by the envelope). Narrowing adds denials. | No. Partially verified: I did not trace the grant compile path. |
| Desktop-control denials | Yes at default | `features.desktop-control` (`packages/compiler/src/harness.ts:1598`) | No |
| `autoMemoryEnabled: false` and `attribution` in `settings.json` | Yes | No. The settings fragment admits only `hooks` and `permissions`, and the merge only adds (`scripts/lib/build-overlay.mjs:217-225, 295`). Host-local settings may override: unverified, host behavior. | Emit regenerates them |
| Instance identity text | Absent by default | Add: overlay `identity` renders an "Instance identity: …" prompt fragment (`contributor.ts:1273-1292`) | No |

### 2.4 `CLAUDE.md` sections in an instance

| Section | Same as core? | Can the owner edit it, and how | Does an update overwrite it? |
| --- | --- | --- | --- |
| Clean Room | No. The template rewrites it owner-neutrally ("Work here belongs to the owner of this repository…") but keeps the heading "locked floor" (`scripts/kit/CLAUDE.template.md:10-21`). Core says "Personal work only…". | Yes, by editing `CLAUDE.md`, which is an instance seed. Emit requires only some non-empty hand-written text outside the block, not Clean Room text (`scripts/lib/harness-instruction.mjs:74-81`). `features.private-destination` rewrites only the §Secrets paragraph (`scripts/lib/features.mjs:258-279`). | Not by `launchpad update`, which treats `CLAUDE.md` as an instance file and changes it only through opted-in `change-phrase` actions; `scripts/kit/KIT-ACTIONS.json` declares none. In a starter merge, a both-changed file is kept with `git checkout main -- <path>` (`docs/KIT.md:3214`). Core's own starter refresh replaces the starter's copy only when proven unedited, and otherwise refuses (`scripts/lib/starter-seeds.mjs:350-356`). |
| Evidence before claims | Not shipped. The template has no such section. | The role text carries overlapping rules: "Never guess" (`contributor.ts:234`) and claims-evidence (`:176-180`). Those are fixed. | n/a |
| Shell (zsh) | Not shipped. No zsh rule exists in the template, loadouts or compiler (grep). | Author's own, core only | n/a |
| Shared memory | Not shipped | Core only | n/a |
| Secrets | Instance only (`scripts/kit/CLAUDE.template.md:23-31`) | Editable. A customized paragraph blocks the private-destination election (`scripts/lib/features.mjs:275-277`). | As for Clean Room |
| Start here | Different text (template `:33-56`) | Editable | As for Clean Room |
| The generated block: Read[role] lines, capabilities and residue, and "DotLn has 9 refusals…" | Yes. The block is `mergeHarnessFragments` output and the refusals sentence is the constant `HARNESS_BOUNDARIES` (`packages/compiler/src/harness.ts:1820`). | No. `harness check` compares the block (`scripts/lib/harness.mjs:1121-1126`). `build: "none"` removes it. | Every emit rewrites it |

---

## 3. What an instance can configure today

### 3.1 Settings and their defaults

The page `docs/control/FEATURES.md` is generated from
`scripts/lib/feature-registry.mjs`, through `scripts/features.mjs:59` and
`scripts/lib/features.mjs`.

**Rows the feature page shows (registry, `scripts/lib/feature-registry.mjs:10-221`)**

| Key | Default | What it does |
| --- | --- | --- |
| `features.tinkerer-economy` | true | The executor's economy-comparison support |
| `features.plan-first` | false | Plan, conversation and approval before implementation |
| `features.private-destination` | false | Admits the owner's ordinary links and identifiers. Rewrites §Secrets. |
| `features.desktop-control` | false | Lifts the desktop and operator-browser denial; the operator's in-session request is still required |
| `kit.applyInstanceActions` | false | An update may apply declared instance actions |
| `features.host-codex`, `features.host-copilot` | false | Emits that host's surfaces. Inferred on from committed attestations. |
| `features.auto-update-upstream` | false | A planning or entropy pass may take a starter update without an in-session request |
| `features.verbatim-operator-words` | false | The verbatim and attributed-speech screens advise instead of failing |
| `release.readmeBlock`, `componentVersions`, `corpus`, `publicationCheck` | true | Unread, no effect. The only rows with `scope: core`. |
| `build.loadout`, `build.profile` | null | Unread |
| `build.overlay` | null | The overlay path (see below) |
| `drive.sandbox` | "host" | `host` or `off` for driven phases |
| `budgets.subagentCap` | 20 | Worker-use cap; null disables |
| `budgets.dispatches` | null per field | Per-role process bounds; `local-median` |
| `budgets.drivenSessionCeiling` | 80 (4 × cap) | Descendant cap in a drive |
| `budgets.drivenPhaseTimeoutMs` | null | Extra phase timeout |
| `budgets.retention` | per class | Temporary-root retention |
| `budgets.prune.startBudgetMs` | 1800000 | Prune bound |

**Settings that are real but absent from the feature page**

- **`dotln.config.json` sections** (`scripts/lib/config.mjs:118-134`):
  - `roots` relocates document roots;
  - `repositories`, `classes` and `portfolios` hold target registrations;
  - `historicalWorkOrders`;
  - `derivedOrders` (default WO-900 to WO-999);
  - `release.displayName` (config default "DotLn"; the seed sets
    "DotLn-Enterprise-Starter");
  - `workers` (named workers, `:474-480`);
  - `contributions.operatorAuthor` and `contributions.authors` (sign-off
    exemption; `docs/KIT.md:2691-2709`);
  - `extensions`, an object the kit never reads (`:140-160`).
- **`dotln.models.json`** holds the instance's model rows and prices
  (`scripts/lib/config.mjs:507-560`).
- **Other `budgets.json` keys.** Readers verified only where cited:
  - `memory.*`;
  - `limits.coldStartBytes.<role>`, `readCapBytes`, `sequenceBytes`,
    `prBodyBytes`, `passRefutationMs`, `fastGateMs`;
  - `acceptances`;
  - `spend.daily`;
  - `documents.paragraphWords` (default 120; null means no list; advisory
    only; `docs/KIT.md:4237-4241`).
- **The build overlay** (`scripts/lib/build-overlay.mjs:5-13`; schema at
  `:17-200`; guide at `docs/KIT.md:1084-1163`):

  | Key | What it does |
  | --- | --- |
  | `version` | Must be 1 |
  | `build` | `contributor` or `none` |
  | `identity` | Adds an identity prompt fragment |
  | `equip`, `unequip` | The nine support ids |
  | `narrow` | Allowed and denied effects, resource limits, evidence, expiry, revocation |
  | `grants` | Operator or host-policy grants; each removes an exact denial |

- **`.claude/settings.instance.json`** (`scripts/lib/build-overlay.mjs:208-245`):
  - hooks under `PermissionDenied`, `PostToolUse`, `PostToolUseFailure`,
    `SessionStart` and `Stop` only;
  - permission `allow`/`ask`/`deny` rules;
  - the merge only adds.
- **`docs/control/documents.json`** sets document entry points and kind
  overrides. It is absent in an instance, so defaults apply
  (`scripts/lib/document-kinds.mjs:93-103`).
- **`docs/control/local/terms.txt`** holds the instance's `refuse` and
  `context` entries.
- **`CLAUDE.md` hand-written text.**
- **The `extensions/` root**, which no kit path may use
  (`scripts/lib/config.mjs:140-153`).

### 3.2 Kit behaviors no setting reaches

The registry's own floor list is `notElectable`
(`scripts/lib/features.mjs:231-235`). The only escapes are:

- `build: "none"`, which removes every generated surface and therefore every
  hook-enforced refusal; this is inference from `scripts/lib/harness.mjs:195-210`;
- editing a kit script (the true-fork path), which freezes that file against
  every later update (`docs/KIT.md:3606-3622`). Compiled `dist/` cannot be
  edited at all (`scripts/launchpad.mjs:1633`).

| Behavior | Where enforced | Kind |
| --- | --- | --- |
| Planning-branch fence: writes only under `docs/` and root Markdown. The `docs` root is hardcoded, not the configured one. | `packages/skeleton/src/harness-host.ts:6030-6056`; `HARNESS_REFUSALS` `planning` | Refusal (Claude hook); role text under Codex |
| Refutation receipt before a plan publishes | Ordering: planner role text (`.claude/skills/dotln-planner/SKILL.md:55-56`). Receipt integrity: `checkPlanGate` (`scripts/lib/plan-receipts.mjs:1871-…`), run by `npm run plan -- check` and `test:docs`. The publish helper `scripts/lib/launchpad-publish.mjs` holds no receipt check (grep for "receipt" finds none). | Role text plus a failed check |
| Verification by a separate session | Phase order `active → verifying → final-review` (`scripts/resume.mjs:335-346`); the router launches a fresh actor per phase (router text, `contributor.ts:273-…`). I found no code that refuses the executor's own session dispatching verify (searched `control.mjs`, `resume.mjs`, `harness-host.ts`, `dispatch-bound.mjs`). | Lifecycle state plus role text. A mechanical session check is unverified or absent. |
| Final review before merge and release | `scripts/resume.mjs:342-346, 459`; reviewer publication | Lifecycle refusal of illegal actions |
| Release close | Release-close role; `release.*` toggles unread | Lifecycle plus role text |
| One writer per worktree | `HARNESS_REFUSALS` `writer`; unit concurrent-work-requires-worktrees; listed in `notElectable` | Refusal |
| Live-gate write protection | `HARNESS_REFUSALS` `gate` | Refusal |
| Outside-project writes | `HARNESS_REFUSALS` `outside-write`; grants come from roles and supports (`contributor.ts:43-69`) | Refusal. Whether an overlay grant can add an outside root kind is unverified. |
| Review worker's test-runner gate | `HARNESS_REFUSALS` `worker-gate` | Refusal |
| `gh` repository naming | `HARNESS_REFUSALS` `gh-repository` | Refusal |
| Router spawn and write, plan-first, target refusals | `DOTLN_ROUTER_*`, `DOTLN_PLAN_FIRST_REFUSED`, `DOTLN_TARGET_*` in `harness-host.ts` | Refusal. Plan-first is electable. |
| Terms screen | `scripts/lib/launchpad-publish.mjs` (an absent list refuses; `docs/KIT.md:1555-1557`); the export (`scripts/launchpad.mjs:1328`); `harness check` status | Refusal. The entries are the instance's; the screen is not optional. |
| Paraphrase, not quote | `scripts/docs-check.mjs:2181-2275`; `operatorWordsRule` in every role (`packages/compiler/src/harness.ts:474-475`) | Failed check. **Electable** through `features.verbatim-operator-words`; the role sentence stays. |
| No AI attribution | The no-attribution unit's hooks; `settings.json` `attribution`; `hasAiAttribution` in the publish helpers | Refusal plus settings. Not electable. |
| No lint or type suppressions as fixes | PostToolUse hook | Refusal. Not electable. |
| Three document kinds; entry points name standing documents only; standing documents need a reader | `scripts/lib/document-kinds.mjs:26-30`; `scripts/docs-check.mjs:2108-2123` | Failed check. `documents.json` relocates kinds and entry points; the rule stays. |
| A red tag lives one planning pass | `scripts/docs-check.mjs:2133-2137`; `scripts/lib/plan-documents.mjs:156` | Failed check |
| Criteria form: one judgment per declared criterion, receipts on the handoff identity | `scripts/lib/handoff-ledger.mjs:195-240` through `scripts/resume.mjs:86`; parsing in `scripts/lib/work-order-document.mjs:68-110` | Failed check at completion |
| No branch commits before final review; never reset, clean or stash-drop | `common` role text (`contributor.ts:247`); no hook found (grep of `harness-host.ts`) | Role text |
| Review ladder and three reviewers per execution | `reviewerBriefs` and rules (`contributor.ts:86-104`); executor steps | Role text, plus the review helper |
| Rules a pass records, checked against the journal | `npm run plan -- check` (`docs/KIT.md:1216-1236`) | Failed check |
| Context-terms reading before `test:docs` | Role text (`contributor.ts:105-106`) | Role text |
| Clean Room floor | Template text; `clean-room` mechanic; `notElectable`; residue line | Text plus not-electable. No code requires its words. |

---

## 4. Does anything label a rule as the author's or the platform's?

**No rule-level label reaches an instance.** These partial mechanisms exist:

1. **The feedback unit `scope` field.** Every unit says
   `["personal-profile", "equipped-feedback-host"]` (`feedback.ts:29`). The
   exported name is `personalFeedbackUnits` (`:187`). Nothing reads `scope`
   (grep). This is the closest existing label, and it is dark.
2. **The feedback unit `enforcement` field** (`hard | soft | advisory`,
   `packages/compiler/src/feedback.ts:44`). This is a ready slot for an
   owner's strength choice. Product 03's owner-sovereign candidate wants
   "classify a rule as hard, advisory, or absent"
   (`docs/product/03-architecture.md:297-304`).
3. **SharedRule records** `{id, roles, text}` (`contributor.ts:134-138`).
   The rule-by-role table is kept with WO-276 evidence
   (`docs/product/07-execution-guide.md:4907-4914`). There is no owner or
   layer field.
4. **The feature registry's `scope` (core | instance | both).** It is
   rendered in `FEATURES.md` with the sentence that a core row "describes
   core's choices, not a rule this instance must adopt" (`docs/KIT.md:1075`).
   Rules are not rows, and the only `core` rows are four unread release
   toggles.
5. **The worker table's provenance.** Each model and binding carries
   `source: "kit"` or `file#key`
   (`packages/skeleton/src/worker-catalog.mjs:321-350`), printed as
   "from the kit" (`scripts/lib/worker-launch.mjs:191-200`). This is the one
   place where a value's origin, kit or instance, is shown to the owner. It
   is a working precedent for marking rules the same way.
6. **The Origin comment and the harness manifest `origin`/`residue`.** These
   list component ids, the `loadoutId` and the `semanticHash`
   (`packages/compiler/src/harness.ts:1549`, `:1693`). They name what, not
   whose.
7. **The principles' layer labels**: platform contract, personal profile,
   repository governance, mixed boundary
   (`docs/product/01-principles.md:10-13`, applied to P1 to P18), and
   product 03's three-column boundary table (`:70-112`). This is the
   vocabulary, but only in core documents.
8. **The build overlay's equip/unequip.** The compile entry
   `contributorConfiguredProgram(switches, overlay)` (`contributor.ts:1323`)
   is the natural seam for extending removal to units and shared rules.
   WO-076's reopen condition is "a fork needs a unit the switches do not
   name" (`docs/work-orders/WO-076-instance-build-overlay.md:227-231`).
9. **WO-207's extension point, shipped as WO-276 Part K**
   (`docs/work-orders/WO-276-the-queue-lands-as-one-order.md:1145-1170`).
   - It gives an owner the `extensions/` root, the
     `.claude/settings.instance.json` fragment that only adds, and the
     `extensions` config section.
   - It explicitly excludes a loader, "an instance's own document kinds or
     order sections", and "anything that lets a fragment weaken an emitted
     refusal" (`:4879-4885`).
   - It is additive only. It cannot carry removal or replacement of an
     author rule.
10. **The candidate shape already written** for FUP-edefd92233980b63:
    "marked blocks in product 07 and the loadout that an instance overlay
    may replace, as `dotln-purpose` is declared"
    (`docs/planning/work-order-map.md:4007-4015`).

---

## 5. The record of this idea, dated

Dates come from document text unless marked "commit date". The commit dates
were read once with a `git log` format that included `%ad`. That was outside
the brief's `--format='%h %s'` rule. It printed dates only, no author line.

1. **2026-08-31.** The operator's directive Common legos, local secret
   sauce (`docs/lineage/idea-ledger.md:9047`, entry `:9113-9123`) has each
   implementation own its doctrine.
   - It was adopted into Principle 18
     (`docs/product/01-principles.md:116-125`).
   - Outcome: a principle, with no mechanism.
2. **2026-09-01** (commit `d32e68999`, WO-004). The README bet "The
   substrate is shared; the doctrine is yours" (now `README.md:132`).
   Outcome: text only.
3. **2026-09-03.** In the WO-016 ideation breakout the operator corrected
   that authority, evidence, replay and Clean Room strictness are the
   author's personal implementation, not the platform's
   (`docs/work-orders/WO-016-skeleton-reactor.md:387-415`).
   - ADR-0006 was accepted that day
     (`docs/decisions/0006-platform-mechanisms-instance-doctrine.md:1-66`):
     - Decision 6: Clean Room is not universal;
     - Decision 7: start in documentation and capability declarations; a
       later order may separate manifests and conformance.
   - The ledger records it as adopted
     (`docs/lineage/idea-ledger.md:7178-7222`).
   - The README "implementation loadout, not commandments" passage entered
     in commit `b5c120f18`.
   - Outcome: documentation and labels. "WO-016 adds no owner-sovereign
     runtime mode … nominates later implementation work" (ADR-0006
     `:87-89`).
4. **2026-09-06.** The phase-two planning amendments to ADR-0006 (`:112-133`):
   - WO-033 is nominated: the starter export; "the kit is the shared
     mechanism, the fork's overlay is the doctrine";
   - WO-033's text says the overlay "may … unequip any unit"
     (`docs/work-orders/WO-033-compiled-starter-export.md:341-348`).
   - WO-033 was superseded on 2026-09-08 by split orders (HISTORY card).
5. **2026-09-08.** The critical-path pass lists the owner-sovereign profile
   as a phase-four "deferred candidate"
   (`docs/planning/passes/critical-path-2026-09-08.md:493`). The map
   candidate was allocated for PresencePolicy (WO-067) and portfolios
   (WO-100); "the owner-sovereign profile stays unallocated"
   (`docs/planning/work-order-map.md:2057-2060`).
6. **2026-09-19.** The cleanup pass deferred FUP-0082 (the owner-sovereign
   profile): "no external principal or second owner exists". It reopens on
   "an external principal or a second owner" (`docs/planning/followups.json`,
   entry FUP-0082). The condition is still unmet in the record (inference;
   no reopen disposition exists).
7. **2026-10-07.** The planning pass decided that WO-076's "extra units" are
   "the existing support switches", since "the tree has no data-defined
   unit catalog". It reopens when "a fork needs a unit the switches do not
   name" (`docs/work-orders/WO-076-instance-build-overlay.md:136-142,
   227-231`). This is the first narrowing.
8. **2026-10-10** (commit `371a1b287`). The front-page rewrite kept "the
   author's own loadout, not commandments" (`README.md:35-37`).
9. **2026-10-11.** Operator direction: the operator's personal instance and
   DotLn-Angular carry the same posture and the same clean-room floor as
   core (`docs/product/03-architecture.md:256-262`).
10. **2026-10-12.** WO-076 closed at v0.76.0: the build overlay of identity,
    supports, narrowing, grants and build none, recorded as ADR-0006
    amendment `:104-110`. Outcome: the only shipped configurability of the
    build.
11. **2026-10-13.** The standard pass recorded that WO-207's word only
    describes the operator's preference for the operator's own fork, not a
    rule for every owner, to be reopened at WO-207's activation
    (`docs/planning/passes/standard-pass-2026-10-13.md:1055-1057`). WO-207
    never activated.
12. **2026-10-18.** In the fork-observations pass the operator asked which
    rules are base machinery, which are the core operator's own and which
    the fork owner's, and how each is changed
    (`docs/planning/passes/fork-observations-2026-10-18.md:37-38`).
    - The pass found "a real gap": a fork "cannot decline one without
      true-forking the file" (`:133-145`).
    - It recorded candidate 2, Core-operator decisions marked in kit text
      for instance override, as a NoOp (`:356`;
      `docs/planning/work-order-map.md:4007-4015`).
    - FUP-edefd92233980b63 was deferred. It reopens when a fork true-forks
      product 07 or a skill to decline a core-operator rule, or asks to; or
      WO-207 and WO-096 close (followups.json).
13. **2026-10-30.** In the features-config pass the operator's items 2, 2.a
    and 2.b (a readable features file; an inventory; operator-specific
    loadouts vs core-specific) became WO-241
    (`docs/planning/passes/node24-features-config-plan-first-no-work-stream-2026-10-30.md:32`).
    - The pass recorded the assumption that 2.b is "the scope of a feature
      (core, instance or both), not … the compiled loadout ids", to be
      reopened on the operator's word (`:45-50`; WO-241 `:378-392`).
    - In the consolidation, FUP-edefd92233980b63 was allocated to WO-241 as
      a carry-in: core-operator kit text is marked so that an instance
      knows what it may decline (WO-241 `:356-360`).
    - This is the second narrowing.
14. **2026-11-02.** WO-251, desktop control off by default (v0.109.0). This
    is an example of an author preference turned into an election.
15. **2026-11-03.** At WO-241's final review the carry-in was "delivered as
    the registry's scope field with the kit guide's and the feature page's
    sentence that a core row describes core's choice and binds no instance"
    (`docs/evidence/WO-241/decisions.md:653`). No kit rule was marked.
    - Released as v0.114.0.
    - Its non-goals: "electing anything the floor forbids (the six
      refusals, the writer reservation, the clean-room floor)" (WO-241
      `:381-384`).
    - This is the third narrowing.
16. **2026-11-07 and 2026-11-08.** WO-258 (host elections and
    auto-update-upstream, off by default) and WO-259 (the
    verbatim-operator-words opt-out, v0.122.0). More author rules became
    elections, one at a time.
17. **2026-11-09** (whole-plan review and sequence). Both orders whose close
    would reopen FUP-edefd92233980b63 moved to "Not now"
    (`docs/planning/sequence.md:145-165`):
    - WO-207: "extension point shipped as Part K of WO-276 (v1.0.0) without
      the loader. The rollback, the build channel and the declared suites
      wait for a need an instance reports".
    - WO-096: reopens "when a measurement names" a sentence only a
      mechanism can replace.
    - Note: WO-096 would *add* twelve more units to `personalFeedbackUnits`
      (`docs/work-orders/WO-096-migration-ledger.md:413-420`). That is more
      author doctrine in every instance, with no removal path.
18. **2026-11-10, v1.0.0.** WO-276 Part K shipped the additive-only
    extension point and excluded weakening an emitted refusal and instance
    document kinds (WO-276 `:1145-1170`, `:4879-4885`). WO-207 "is set down
    and is recut around this root before it reopens".
19. **2026-11-15.** WO-279 (queued): the critic of conduct launches only
    when asked, with its cadence electable through `features.critic-cadence`
    and off by default (`docs/work-orders/WO-279-…:84-95, 375-381`). Not
    built.

**Orders meant to deliver the split, and their state**

| Order | State | What it was meant to deliver |
| --- | --- | --- |
| WO-016 | closed | Documentation boundary |
| WO-033 | superseded | Starter export; overlay may unequip any unit |
| WO-076 | closed, v0.76.0 | Overlay, supports only |
| WO-209 | superseded by WO-207 | Build channel |
| WO-207 | draft, "Not now"; its Part K shipped in WO-276 | Extension point |
| WO-096 | draft, "Not now" | Adds author units |
| WO-241 | closed, v0.114.0 | Feature registry; the carry-in reduced to `scope` |
| WO-266 and WO-275 | superseded into WO-276 Parts J and G | Workers table; Claude-only start |
| WO-279 | queued | Critic cadence election |

Two follow-ups are left on the register:

- FUP-0082 (the owner-sovereign profile): deferred.
- FUP-edefd92233980b63: closed as allocated to WO-241, and in substance
  undelivered.

**Why it has not progressed (inference from the above):**

- Each request was converted to the cheapest proxy:
  - support switches (2026-10-07);
  - a registry `scope` field (2026-10-30);
  - a sentence (2026-11-03).
- The reopen conditions depend on events no scheduled order produces: a
  second owner, a fork true-forking a skill, or WO-207 and WO-096 closing.
- Core keeps the documents that state the split (ADR-0006, principles,
  product 03), so no instance-side reader ever meets it.

---

## 6. Three smallest changes

1. **Make the split visible from existing fields. Documentation and
   generation only.**
   - Give each SharedRule a `layer` (`platform` | `author`) and read the
     feedback unit's existing `scope` (`personal-profile`).
   - Render one table in `docs/control/FEATURES.md` through
     `npm run features -- list`. Each row gives a rule id, its layer, how it
     is enforced (hook, check or role text) and whether it is removable.
   - Correct the "Not electable" list (`scripts/lib/features.mjs:231-235`;
     `docs/KIT.md:1006-1009`) so that it names only true platform floors.
     Today it lists Clean Room, which ADR-0006 Decision 6 classes as
     repository governance.
2. **Make author rules removable through the overlay that already exists.**
   - Extend `equip`/`unequip` to accept feedback unit ids and `author`-layer
     shared-rule ids. The validator is at
     `scripts/lib/build-overlay.mjs:84-89`.
   - Filter `personalFeedback()` (`scripts/lib/harness.mjs:246`) and each
     role's `feedbackHandlers` and `boundTo` rule list
     (`contributor.ts:82`, `:861-864`) before lowering.
   - This is WO-076's recorded reopen condition, and it needs no new file.
3. **Tell the instance owner, in kit files.**
   - Add one KIT.md section, carried to every instance, that holds:
     - ADR-0006's boundary table, which today exists only in core's
       product 03 (`:96-108`);
     - the generated rule table from change 1;
     - the overlay route.
   - Have `scripts/kit/CLAUDE.template.md` mark its Clean Room and Secrets
     sections as editable starter defaults instead of a "locked floor".

---

## 7. Search boundary and unverified items

**Searched**

- `scripts/launchpad.mjs`, `scripts/lib/{starter-seeds,starter-refresh(not read in full),harness,build-overlay,features,feature-registry,config,document-kinds,launchpad-publish,handoff-ledger,plan-receipts (partial),worker-launch}.mjs`.
- `scripts/{harness,features,resume (partial),docs-check (partial),refute-plan (partial)}.mjs`.
- `scripts/kit/*`.
- `packages/skeleton/src/loadouts/*.ts`.
- `packages/compiler/src/{harness,feedback}.ts` (partial).
- `packages/skeleton/src/harness-host.ts` (grep and one region).
- `packages/skeleton/src/worker-catalog.mjs` (part).
- `docs/KIT.md` (sections cited), `docs/OPERATOR.md` (grep),
  `docs/PLAYBOOK.md` (headings), `README.md`, ADR-0006.
- `docs/product/{00,01,03,06,07(grep),feature-configuration}.md`.
- `docs/planning/{sequence,work-order-map}.md` (regions).
- `docs/planning/followups.json` (four entries).
- Six planning passes (regions).
- Work orders WO-016, 033, 076, 096, 207, 241, 276, 279 (regions).
- `docs/evidence/WO-241/decisions.md` (one decision).
- `docs/work-orders/{README,HISTORY}.md` (cards).
- `git log -S` on README.

**Not read**

- `docs/intake/` and `docs/control/local/`, by rule.
- The parent's untracked pass file.
- The DotLn-Enterprise-Starter repository itself. What the starter
  currently holds is unverified; this report describes what the export code
  writes.

**Unverified**

- Whether a mechanical check refuses one session doing both execution and
  verification. I found none.
- Whether an overlay grant can add an outside-write root kind.
- The full compile path by which an overlay grant removes the ssh denial.
  This follows `docs/KIT.md:1146-1153` and one filter at
  `contributor.ts:1265-1272`.
- Readers of the unlisted `budgets.json` keys (`memory`, `limits`,
  `spend`).
- Whether host-local `.claude/settings.local.json` can override
  `autoMemoryEnabled` and `attribution`. That is host behavior.
- Whether `build: "none"` leaves any writer reservation in force through
  lifecycle code under Claude Code. This is inference.
