# WO-095 — Full-set scenario and set tooltip render: the Repo Gardener equips all six pieces in a second deterministic scenario with live and replay identity, and `--compiled-diff --loadout` renders each piece and the set with its bonuses armed or dark (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Front page:** README.md
**Release classification:** minor. A second scenario and a render selector.
Assigned at activation under the standing opt-out default.
**Cost:** adds a second deterministic scenario that equips the six pieces
on the Repo Gardener (`packages/skeleton/src/scenario.ts`, and the reactor
if the scenario needs it), a `--loadout <id>` selector for the skeleton
CLI's `--compiled-diff` (`packages/skeleton/src/cli.ts`), the set summary
in `packages/compiler/src/render.ts`, fixtures, at most 200 bytes in
product 06, one sentence folded into the README's "What runs today" and
one appended capability-table section. Removes: the one scenario runs
Seiri alone, and nothing renders a set. Re-mints: deterministic, each
edition selected in `docs/evidence/current.json` whose check `scenario.ts`,
`render.ts` or the two package manifests stale; the compiler release
moves the policy hash the console binds, so the feedback edition is
carried (`feedback-evidence --carry`), the console is re-pinned, the four
console self-host fixtures that record that hash follow the label (WO-154
D011; WO-162 D011 and D012) and the harness bundle is regenerated; a
change to `packages/skeleton/src/reactor.ts`, which the feedback verifier
judges, owes one live feedback self-host episode, which the executor runs
on a configuration the operator's 2026-09-28 direction accepts
(criterion 3). Wall-clock, tokens and context bytes are unknown until
run.
**Nomination provenance:** WO-037's scenario and tooltip items, cut into a
bounded child at the operator's 2026-09-08 correction. Planner-synthesized
draft. Opaque identifier, not a priority. Clean-room screen: no stop
condition. Register row FUP-0024, the critical-path plan's deferred
pattern-workshop entry, is allocated to WO-091 to WO-095 by the 2026-09-19
cleanup pass and reopens if one of them is withdrawn. Amended by the
2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the console's pins and label-bound fixtures follow the
releases while its source stays unedited, the frozen outputs and the
capability section are named in the forms the repository checks, and a
live episode the reactor owes runs in the executor's session
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-094 merged (the bonuses the scenario exercises); WO-032
merged (the board renders the set through the compiler render; satisfied
at `v0.14.0`); WO-042, reference only (the Safety piece's deny at
safety-invariants remains legal; closed, `v0.16.0`).
**Recommended placement:** last of the five workshop orders in the serial
run, after WO-094 and before WO-088 (`docs/planning/sequence.md`). This
order edits `packages/skeleton/src/scenario.ts`, `cli.ts` and, if needed,
`reactor.ts`, `packages/compiler/src/render.ts`, their tests and fixtures,
product 06, the README, the capability table, and the console's pins and
self-host fixtures the releases move; it edits no console source. WO-088,
next, edits a different section of the README; WO-089, last, folds the
capability table this order appends to. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-094",
    "relation": "hard",
    "reason": "the bonuses the scenario exercises"
  },
  {
    "workOrderId": "WO-032",
    "relation": "satisfied-by-release",
    "release": "v0.14.0",
    "reason": "the board renders the set through the compiler render"
  },
  {
    "workOrderId": "WO-042",
    "relation": "reference-only",
    "reason": "the Safety piece's deny at safety-invariants remains legal"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `packages/skeleton/test/scenario.test.ts`
and the frozen WO-003 oracle it reads,
`packages/skeleton/fixtures/wo003-decision-traces.json` (the 13-step
scenario); `packages/skeleton/test/cli.test.ts` (the pinned CLI output);
04-interfaces.md §RPG / Path-of-Exile view (tooltip anatomy);
06-roadmap.md §Application version pending — Pattern workshop v1 (the
compiler-side slice); `packages/skeleton/src/cli.ts` (`--compiled-diff`),
`packages/skeleton/src/console-commands.ts` (`skeleton.compiled-diff`),
`packages/compiler/src/render.ts` (`renderCompiledDiff`,
`renderViewHashes`), `packages/skeleton/src/reactor.ts`;
`packages/console/src/collect.ts` (the board's loadout collection);
`scripts/release.mjs` (the component-version and workspace-pin rules);
`docs/evidence/WO-154/decisions.md` D011,
`docs/evidence/WO-162/decisions.md` D011 and D012, and
`docs/evidence/WO-147/decisions.md` D010 (a live feedback self-host
audit); `docs/planning/capability-table.md` with
`scripts/lib/plan-continuation.mjs` (`reassessments`: the appended section
form); `docs/control/doc-ceilings.json`;
`docs/work-orders/WO-037-five-s-equipment-set.md` (the superseded
umbrella; history only).

**Objective:** Beside the frozen 13-step scenario, a full-set scenario
equips all six pieces against the deterministic fakes: candidates with
proposed homes, the integrity check as a fake verifier episode, a repeated
repair yielding a standardization proposal, the reevaluation cadence firing
and cancelled on operator return, the destructive gate refusing; live and
replay produce identical complete Decisions; `--compiled-diff --loadout <id>`
renders each piece's tooltip and the set summary with each bonus armed or
dark and the three view hashes.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- One scenario: `packages/skeleton/src/scenario.ts` exports one
  `runScenario`, which the CLI runs, and it imports the reactor's
  Seiri-bound loadout and constants (`packages/skeleton/src/reactor.ts`).
  The order as filed also said "one shelf entry"; no code or document
  defines the term, and nine loadout modules exist under
  `packages/skeleton/src/loadouts/`.
- Nothing renders a set: `--compiled-diff` compiles and renders the three
  Seiri views only (`packages/skeleton/src/cli.ts`), and `render.ts` has
  no set or bonus output. The console contract's `skeleton.compiled-diff`
  fixes that leading argument and leaves the rest of the grammar to the
  terminal parser (`packages/skeleton/src/console-commands.ts`).
- The board collects every loadout export from the reactor and
  `packages/skeleton/src/loadouts/` (`packages/console/src/collect.ts`),
  so a new loadout needs no console source edit. But
  `packages/console/package.json` pins the compiler and the skeleton
  exactly (0.19.4 and 0.44.3 at `5f3849ec`), the release check requires
  each pin to equal the workspace version and a changed `src` to carry a
  new component version (`scripts/release.mjs`), and four console
  self-host fixtures follow a compiler release (WO-162 D011 and D012). The
  order as filed forbade any edit under `packages/console`, which these
  rules make impossible once it changes `render.ts`.
- Between planning receipts the capability table admits a new row only as
  an appended section headed `## WO-NNN dated addition (YYYY-MM-DD)` or
  `dated reassessment` (`scripts/lib/plan-continuation.mjs`); WO-089,
  after this order, folds those sections at a planning boundary.
- Product 06 §Application version pending — Pattern workshop v1 still
  places WO-037 in wave 4 beside the migration's second batch.

**Design (scope discipline):**

- The 13-step oracle is untouched; the board renders the set through the
  same render without a console source edit.
- The console's `package.json` pins and the self-host fixtures that follow
  the compiler label move with the releases, as the release check
  requires; nothing else under `packages/console` changes, and a board
  change, if one proves necessary, is a separate small follow-on.
- Live and replay run through the one shared reactor. The full-set
  scenario's fake executor returns candidates with proposed homes, the
  integrity check runs as a fake verifier episode, a repeated repair
  yields a standardization proposal in evidence, the reevaluation cadence
  fires and is cancelled on operator return, and the destructive gate
  refuses.
- The set summary's bonus states come from the listing WO-092 adds to the
  compiled program.
- The capability row is an appended
  `## WO-095 dated addition (YYYY-MM-DD)` section, the form the
  continuation check admits; WO-089 folds it with the rest at a planning
  boundary.
- **Declined alternatives, recorded:** a row edited into the capability
  inventory (the plan check refuses a rewritten row between receipts;
  reopen when a planning pass folds the table, WO-089); a console source
  edit (the collection is dynamic and the contract passes the selector
  through; reopen when a board change proves necessary).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; the set module, ids, environment and listing field come from WO-092 to WO-094 at the base):**

1. `packages/skeleton/src/full-set-scenario.ts` (new; decided 2026-10-07: a new module that no
   registered source imports, so `scenario.ts` stays unedited): exports `runFullSetScenario`
   and `replayFullSetScenario` beside the shape of `runScenario` (`scenario.ts` line 359);
   the result carries `bonusEvents` (bonus id, event type, sequence number) taken from
   Decisions, and the test asserts on it, never on the timeline text (prose-parsing screen).
   Check: `node --test packages/skeleton/dist/test/full-set-scenario.test.js` after
   `npm run build`.
2. `packages/skeleton/src/reactor.ts`: accept the full-set program and fold the four bonus
   behaviors (the reactor binds `seiriLoadout` at line 395 and compiles under
   `seiriEnvironment` at 431; no skeleton source interprets a compiled `verifier-episode` or
   `cadence` emission, so this edit is certain, not conditional). The WO-184 criterion-19
   purity test ("transitive reactor purity has exactly two reasoned host exclusions",
   `scenario.test.ts`) limits new imports. Check: `node --test packages/skeleton/dist/test/scenario.test.js`.
3. `packages/skeleton/test/full-set-scenario.test.ts` (new) and one trace fixture under
   `packages/skeleton/fixtures/` (new): "WO-095 live and replay match every complete
   Decision", "each bonus fires once", "the Safety gate refuses the destructive change",
   "operator return cancels the cadence". Oracle: `git diff --exit-code <base> -- packages/skeleton/fixtures/wo003-decision-traces.json`.
4. `packages/compiler/src/render.ts`: new export `renderSetSummary(program)`, re-exported from
   `packages/compiler/src/index.ts`; case "WO-095 set summary lists each bonus armed or dark" in
   `packages/compiler/test/tooltip.test.ts`.
5. `packages/skeleton/src/cli.ts`: accept `--loadout <id>` in the option loop (lines 44 to 54),
   only with `--compiled-diff`; update the usage at line 52; the pinned case "WO-095
   --compiled-diff --loadout renders each piece and the set" in `cli.test.ts`; the four
   existing cases and the WO-142 refusal stay unchanged.
6. Versions: bump `packages/compiler/package.json` and `packages/skeleton/package.json`; set
   `packages/console/package.json` pins equal. Check: `node scripts/release.mjs check-surfaces --local`.
7. Editions, after `npm run build`: `node scripts/authority-evidence.mjs --write --edition WO-095 --revision 001`;
   `node scripts/artifact-identity-evidence.mjs --write`; `node scripts/verification-evidence.mjs --write`;
   `node scripts/harness.mjs emit`; repoint `docs/evidence/current.json` as WO-147-D010 did;
   check each with `--check`.
8. The live feedback episode (the reactor changed, and it is the subject the feedback verifier
   judges): `npm run evidence:feedback -- --write --edition WO-095 --revision 001`, then the
   self-host on the harness the executor runs in (Claude `claude-opus-5-5` at `xhigh` or Codex
   `gpt-6.1-sol` at `max`), then `node scripts/feedback-evidence.mjs --record-selfhost <store> --edition WO-095 --revision 001`.
9. Console: `node scripts/console-fixtures.mjs --record-current-selfhost`, then `--check`;
   only the four console fixture files change.
10. Write-backs: product 06, the pending rung heading for the pattern workshop (found by name at
    the base, because WO-190 moves the rungs): replace the "wave 4" clause of its second
    paragraph, in place; `README.md` §"What runs today" (one sentence inside the marked
    section, under WO-189's rules; this order's `**Front page:**` field names the file) and
    lines 421 to 422 (set bonuses are no longer future); `packages/compiler/README.md` lines
    113 to 114 (the same); `packages/skeleton/src/portfolio.ts` lines 25 to 26 (the comment
    that WO-093 extends the vocabulary, corrected while this order re-mints anyway);
    `docs/planning/capability-table.md`: append `## WO-095 dated addition (<date>)` with the
    header `Capability and scope | Current assessment | Evidence and remaining gate` and a
    `compiler.five-s-set` row; `docs/evidence/WO-095/decisions.md` (new);
    `node scripts/check-publication.mjs`; `npm run meta`; `npm run publication:check`.
11. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-095/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the scenario, the selector, the render, fixtures, the
write-backs below.

**Acceptance criteria (all required)**

1. The full-set scenario runs live and from replay with identical
   complete Decisions and semantic projections, exercises every bonus
   once, refuses the destructive change, and cancels the cadence on
   operator return; `packages/skeleton/fixtures/wo003-decision-traces.json`
   is byte-identical to the order's base, and the existing expectations of
   `packages/skeleton/test/scenario.test.ts` and `cli.test.ts` hold
   unchanged.
2. `--compiled-diff --loadout <id>` renders, and fixtures pin, each
   piece's original term, translation, kanji, RPG title, GRANTS,
   RESTRICTIONS, OBLIGATION, PASSIVE, PULSE, INTERRUPT and declared cost,
   and the set summary with each bonus armed or dark and the three view
   hashes.
3. If the order changes `packages/skeleton/src/reactor.ts`, the executor
   runs one live feedback self-host episode after its last edit to a
   judged source, on Codex `gpt-6.1-sol` at `max` or Claude Code
   `claude-opus-5-5` at `xhigh` (the operator's 2026-09-28 and 2026-09-30
   directions), and
   mints the feedback edition from it (the audit and
   `node scripts/feedback-evidence.mjs --record-selfhost`, as WO-147 D010
   records); the decisions file records which configuration ran. A repair
   that edits a judged source again runs another episode the same way. An
   unchanged `reactor.ts` meets the criterion.
4. Write-backs land: 06 §Application version pending — Pattern workshop
   v1, in place with no dated paragraph (its second paragraph names the
   compiled slice instead of wave 4, in place with no dated paragraph (ceilings are planning's since the 2026-10-07 pass); WO-083, WO-096, WO-098 and
   WO-183 also write 06, and WO-190 moves its rungs); one sentence
   folded into README §What runs today, rewriting what it supersedes, as
   the block's own rule says; an appended
   `## WO-095 dated addition (YYYY-MM-DD)` section in the capability table
   assessing
   `compiler.five-s-set` at the level its evidence supports (level 1 —
   demonstrable is the target); the decisions file; the publication locks
   refreshed.
5. Every edition the Cost line names is re-minted or carried, the console
   re-pinned with its self-host fixtures and the harness bundle
   regenerated; nothing under `packages/console/src/` changes; the
   decisions file records each.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency; kernel unchanged.

**Evidence gate:** the fixture transcripts; the live self-host record when
`reactor.ts` changed; `npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `packages/skeleton/src/scenario.ts` and
`packages/compiler/src/render.ts` are declared sources of the authority-,
artifact-, verification-, feedback- and harness-evidence suites, and again
at final review. The live row is the executor's feedback self-host
episode, owed only if `reactor.ts` changes.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- 2026-10-07 pass: the Cost line's "the reactor if the scenario needs
  it" is certain (step 2), so the live feedback episode is planned, not
  conditional. Stale and corrected: product 06's figures; the console
  pins; WO-086, WO-087, WO-066, WO-061, WO-124 and WO-112 closed; the
  README rule is WO-189's.
- Decided by the 2026-10-07 pass: the scenario in a new module;
  `bonusEvents` typed (prose-parsing screen); the README and
  `portfolio.ts` corrections WO-093 and WO-094 left land here.
- Blocked on WO-094 (behind WO-092, WO-093 and WO-091) and WO-189.

**Non-goals:** drag-equip authoring; any console source change; a row
edited into the capability inventory.

**Operator-review assumptions**

1. The second scenario stands beside the frozen oracle.
