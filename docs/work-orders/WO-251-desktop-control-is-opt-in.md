# WO-251 — Desktop control is opt-in: the hook and the emitted host settings refuse the desktop-control tools unless `dotln.config.json` elects `features.desktop-control`, browser verification is the Playwright MCP's snapshot, screenshot and image read, and every role's text says so (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Release classification:** minor. One new refusal class in the hook and
the emitted settings, one configuration key with a default of off, one
sentence in every role; an instance that elects nothing is refused the
tools it was never meant to use. Assigned at activation under the standing
opt-out default.
**Cost:** adds, in `scripts/lib/config.mjs` (`SECTION_KEYS`, 100 to 113),
the `features` section with one known id, `desktop-control`, as `true`,
`false` or `{ "on": boolean, "note": "<the operator's reason>" }` (the
shape WO-241's Design fixes for every feature), an unknown id refused by
name, absence meaning off; in `packages/skeleton/src/harness-command.ts`
(`harnessToolEffects`, 10 to 55) a `desktop` effect for the tool names a
host gives desktop control: names starting `mcp__computer-use__`,
`mcp__remote-devices__computer_` or `enable__mcp__remote-devices__computer`,
and the `Skill` tool invoked with `anthropic-skills:computer-use`; in
`packages/skeleton/src/harness-host.ts` (the permission judgment near
`permissionEffect`, 4862 onward, where an unclassified tool today raises a
classification advisory and host permissions decide) the refusal
`DOTLN_DESKTOP_CONTROL_REFUSED` for a `desktop` tool while the election is
off, naming the key, the Playwright route and that the operator's word in
the session is still needed when the election is on, and one advisory when
the election is on and the tool is admitted; in
`packages/compiler/src/harness.ts` (the emitted settings' `permissions.deny`,
1190 to 1197, derived from the envelope's denied effects) the same tool
patterns as `deny` entries while the election is off, so Claude Code's own
permission layer refuses before the hook runs, and their absence when it
is on; in `packages/skeleton/src/loadouts/contributor.ts` one shared
sentence every role reads: browser verification of a web surface is the
Playwright MCP's accessibility snapshot, screenshot and image read, or the
project's own browser test tooling; desktop control (screenshots of the
desktop, clicks, typing outside a browser the session drives) is refused
unless the instance elects `features.desktop-control` and the operator's
words in the session ask for it; in `scripts/kit/CLAUDE.template.md` and
`scripts/kit/dotln.config.example.json` the key with its default and the
sentence; the generated refusals sentence (`packages/compiler/src/harness.ts`
1340) counting seven refusals and naming this one; cases in
`scripts/test-harness-fixtures.mjs` (refused off, admitted on with the
advisory, the Skill form), `scripts/test-configuration-root.mjs` (the
section's validation), `scripts/test-compiler.mjs` or the compiler suite's
settings case (the deny entries present off and absent on) and
`scripts/test-harness.mjs` (the roots carry the sentence; `harness check`).
Removes: the state where nothing in the kit says how a session verifies a
browser surface or forbids taking over the operator's desktop, so a
session chose native desktop control without asking (the operator's item
10 of 2026-11-01), where the hook classifies every MCP tool as unclassified
and advisory (host permissions decide), and where the Codex worker
transport disables `computer_use` and `browser_use` for workers
(`worker-transport.ts` 314 to 337) while a Codex session or any Claude
session has no such rule. Wall-clock: one name match per judged tool call,
measured before and after. Context bytes: this file, about 11,000; each
role root grows by one sentence, measured against its ceiling under the
standing route. Commands: none new. Tokens: unknown until run. Steps: 7.
Re-mints: `harness-host.ts`, `harness-command.ts` and `contributor.ts` are
runtime sources the executor checks against `scripts/lib/evidence-sources.mjs`
at activation and re-mints deterministically where an edition is staled;
no feedback-judged source changes, so no live feedback episode;
`harness-host.ts` and `contributor.ts` are declared machinery sources, so
`npm test -- --review` runs before handoff.
**Nomination provenance:** the operator's item 10 of the 2026-11-01
planning dispatch (ignored capture
`docs/intake/notes/planning-fork-blocks-close-residue-reviews-criteria-and-desktop-opt-in-2026-11-01.md`,
SHA-256 `65b3db5f78aa7bdba95e94ce62e12015afbc144e058b5699767040e37b22d0a2`):
a session in the operator's instance chose native desktop control without
asking and then stopped itself; the operator's rule: Playwright MCP
verification is DOM inspection plus screenshot and image analysis, and
computer takeover is an opt-in support, configuration or build that never
happens unless explicitly turned on. Filed by the
[2026-11-01 pass](../planning/fork-blocks-close-residue-reviews-criteria-desktop-opt-in-2026-11-01.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen:
no stop condition.
**Depends on:** WO-144 (closed: the outside-project write grant, the fifth
refusal, whose refusal shape and settings emission this order follows);
WO-218 (closed: `dotln.config.json` shipped in core with its section
validation); WO-234 (closed: the sixth refusal and the generated refusals
sentence this order extends to seven).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-144",
    "relation": "satisfied-by-close",
    "reason": "the refusal shape and the emitted deny entries a hook refusal is paired with"
  },
  {
    "workOrderId": "WO-218",
    "relation": "satisfied-by-close",
    "reason": "the configuration file and its section validation the features key joins"
  },
  {
    "workOrderId": "WO-234",
    "relation": "satisfied-by-close",
    "reason": "the generated refusals sentence that counts the floor's refusals"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/src/harness-command.ts`
(`harnessToolEffects` 10 to 55: the inventory of tool names and effects,
`Skill` as `interaction`, no MCP name); `packages/skeleton/src/harness-host.ts`
(`permissionEffect` 4862 onward and the `Unclassified effectful tool`
refusal at 4884 to 4887, which the hook's catch at 6925 to 6945 reports as
a classification advisory; the spawn admission 6369 onward);
`packages/compiler/src/harness.ts` (the settings emission 1190 to 1230 with
`permissions.deny` from denied effects; the refusals sentence 1340);
`packages/skeleton/src/worker-transport.ts` (`codexDisabled` 314 to 337:
`computer_use`, `browser_use`, `in_app_browser` disabled for Codex
workers); `scripts/lib/config.mjs` (`SECTION_KEYS` 100 to 113);
`scripts/kit/dotln.config.example.json`; WO-241's Design (the `features`
section's shape and the registry that will describe this feature); product
07 §Discipline (the six refusals; host permissions decide for other tools);
the operator's quoted session text in the nomination capture.

**Objective:** No session takes over the operator's desktop unless the
instance turned that on and the operator asked in the session. A web
surface is verified through the browser the session drives: the Playwright
MCP's snapshot of the DOM and accessibility tree, a screenshot read as an
image, and the project's own browser tests. The rule is enforced where the
host lets the kit enforce it and written where it cannot.

**Observed gap (dated 2026-11-01 at `main` `64286ff8`, v0.107.0):**

- No product document, role text or kit template mentions browsers,
  Playwright, screenshots or desktop control as a verification route or a
  boundary: a search of `docs/product/`, `.claude/skills/`, `CLAUDE.md` and
  `scripts/kit/CLAUDE.template.md` on 2026-11-01 finds product 07's line
  3621 ("desktop activation is not established", about a resident's wake)
  and product 05's line 1144 (a browser algorithm, about the Entropy
  Reducer) and nothing else.
- The hook's tool inventory (`harnessToolEffects`) names no MCP tool; a
  tool it does not know raises `Unclassified effectful tool`, which the
  hook's catch reports as a classification advisory, so host permissions
  alone decided when a session in the operator's instance enabled desktop
  control.
- The Codex worker transport disables `computer_use`, `browser_use` and
  `in_app_browser` for the workers it launches (`codexDisabled`), the one
  place the kit says anything about desktop control; a Codex session the
  operator opens and every Claude session have no such rule.
- `dotln.config.json` has no `features` section (WO-241 files it, seventh in
  the queue); the kit's example configuration shows `roots`,
  `derivedOrders`, `repositories`, `build`, `release` and `drive`.

**Design (scope discipline):**

- **Off unless elected, and elected is not enough.** The election makes the
  tools admissible; the operator's words in the session make their use
  authorized, as every outward or irreversible effect is. Rejected: an
  election that admits use without words (axis: the operator's item 10 says
  never without asking; the election is the instance's standing permission
  to be asked). Rejected: a per-order header (axis: the operator named a
  support, configuration or build; an order's header is read by one order).
- **Two layers where the host has two.** Claude Code's `permissions.deny`
  refuses the tool before any hook runs and survives a hook failure; the
  hook's refusal names the key and the route, which a bare host denial
  cannot. Both are emitted from the same election by `harness emit`, so
  `harness check` finds a settings file that disagrees with the
  configuration. Rejected: the hook alone (axis: a hook that cannot run
  leaves host permissions deciding, which is the gap). Rejected: the deny
  entries alone (axis: a denial without a reason sends the session looking
  for another route; the fork's session apologized and chose Playwright
  only after the fact).
- **The key is WO-241's shape.** `features.desktop-control` follows the
  `features` section WO-241 defines (`true`, `false` or `{on, note}`);
  WO-241's registry gains this id as a row with `readBy: harness-host.ts`
  and absorbs the one-id validation this order adds, so no instance
  migrates. Rejected: a key under `drive` or `kit` (axis: the election
  belongs to the instance's features, which is what WO-241 builds).
- **Codex and Copilot carry the rule as text.** Codex tool calls are
  unhooked; the worker transport already disables the features for workers;
  a Codex session reads the sentence in `AGENTS.md`. Copilot reuses the
  Claude registration. Rejected: a Codex `config.toml` the kit writes
  (axis: the kit does not change operator host settings; kit README §First
  steps).
- **Live-run surfaces at the base.** The configuration loader, the tool
  inventory, the settings emission, the refusals sentence: exist. The
  section, the effect, the refusal, the deny entries, the sentence: absent.

**Execution plan (the executor follows these steps in order; observed at `64286ff8`, 2026-11-01):**

1. `scripts/lib/config.mjs` (`SECTION_KEYS`): the `features` section with
   the one known id and WO-241's value shape; an unknown id refused by
   name; `readFeatures(root)` or the loader's equivalent returning the
   election with absence as off. Check: `npm test -- --only
   configuration-root`.
2. `packages/skeleton/src/harness-command.ts` (`harnessToolEffects`): the
   `desktop` effect for the three name prefixes and for `Skill` with
   `anthropic-skills:computer-use`; `packages/skeleton/src/harness-host.ts`:
   the refusal while the election is off and the advisory while it is on,
   read from the configuration at judgment time; the refusal's duration
   recorded. Check: `npm test -- --only harness-fixtures`.
3. `packages/compiler/src/harness.ts`: the `permissions.deny` entries for
   the tool patterns emitted while the election is off and omitted while
   on; the refusals sentence (1340) counts seven and names this one;
   `harness check` compares the emitted settings with the configuration.
   Check: `npm test -- --only compiler`; `npm test -- --only harness`.
4. `packages/skeleton/src/loadouts/contributor.ts`: the shared sentence in
   the common block every role reads; `npm run sync`; each root measured
   against its ceiling under the standing route. Check: `npm test -- --only
   harness`; `npm test -- --only harness-context`.
5. `scripts/kit/CLAUDE.template.md` (the sentence), `scripts/kit/dotln.config.example.json`
   (`"features": { "desktop-control": false }`) and the kit guide
   (`docs/KIT.md` once WO-245 merges, otherwise `scripts/kit/README.client.md`)
   §What runs here, and what does not (the refusal, the key and the
   Playwright route). Check: `npm test -- --only launchpad`.
6. Write-backs: product 07 §Discipline (the seventh refusal beside the six;
   the verification route for a web surface); `docs/evidence/WO-251/decisions.md`
   (the refusal's measured cost; each root's bytes); re-mint any edition
   the runtime sources stale; `npm run meta`; `node scripts/lineage.mjs
   index --check`; `npm run publication:check`.
7. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the
   independent reviews the executor root requires; one `npm test --
   --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-251/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** the `features` section with its one id; the `desktop`
effect and its refusal; the emitted deny entries; the role sentence; the
kit template, example and guide; the write-backs.

**Acceptance criteria (all required)**

1. In the harness fixture with no `features` section, a PreToolUse input
   naming `mcp__computer-use__screenshot`, `mcp__remote-devices__computer_click`,
   `enable__mcp__remote-devices__computer` or `Skill` with
   `anthropic-skills:computer-use` is refused with
   `DOTLN_DESKTOP_CONTROL_REFUSED`, the message naming
   `features.desktop-control` and the Playwright route; with
   `features.desktop-control: true` the same inputs are admitted with one
   advisory naming the election; a Playwright MCP tool name is judged as
   today in both cases.
2. `dotln.config.json` with `features.desktop-control` as `true`, `false` or
   `{ "on": true, "note": "..." }` loads; an unknown feature id is refused
   naming the id; an absent section reads as off.
3. The emitted `.claude/settings.json` carries the three tool patterns in
   `permissions.deny` while the election is off and none of them while it
   is on; `harness check` reports a settings file whose entries disagree
   with the configuration.
4. Every emitted role root carries the shared sentence; the generated
   refusals sentence counts seven and names desktop control; `harness
   check` passes; each root's bytes are recorded against its ceiling under
   the standing route.
5. The kit template, the example configuration and the kit guide carry the
   key, its default and the route; product 07 states the refusal and the
   route; `npm run publication:check` is green.
6. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only configuration-root` for step 1; `npm test
-- --only harness-fixtures` for step 2; `npm test -- --only compiler` and
`npm test -- --only harness` for steps 3 and 4; `npm test -- --only
harness-context` for step 4; `npm test -- --only launchpad` for step 5;
`npm run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --`; then one `npm test -- --review`
(07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the fixtures of criteria 1 to 4; the deterministic
re-mints of any edition the runtime sources stale; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 6 and criterion 5.

**Known issues and carry-ins:**

- The tool names are those Claude Code gives desktop control on
  2026-11-01 (`mcp__computer-use__*` in the desktop app,
  `mcp__remote-devices__computer_*` from a linked cloud session, and the
  `enable__mcp__remote-devices__computer` switch); a host that renames them
  is matched by name only, so the executor reads the host's published tool
  names at activation and records them (reopen: a desktop-control tool
  reaches a session under a name the inventory does not match).
- A Codex session is unhooked; the sentence in `AGENTS.md` is the rule
  there, and the worker transport's disabled features cover its workers
  (reopen: a Codex session uses desktop control, which no record of a
  Claude hook could have refused).
- WO-241 (seventh in the queue) adds the registry; until it lands this order's
  one-id validation is the `features` section (reopen: WO-241 activates and
  finds the section shaped otherwise).

**Non-goals:** requiring the Playwright MCP to be installed; a browser the
kit launches; changing the Codex worker transport's disabled features;
host settings outside the emitted repository settings; the features
registry and its generated page (WO-241).

**Operator-review assumptions:** that `features.desktop-control` is the
right key and that off is the only default; that both the host's deny
entries and the hook's refusal are wanted, not one of them; that the
operator's word in the session is still required when an instance elects
the feature. Reopen on the operator's word.
