# WO-095 — Full-set scenario and set tooltip render: the Repo Gardener equips all six pieces in a second deterministic scenario with live and replay identity, and `--compiled-diff --loadout` renders each piece and the set with its bonuses armed or dark (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
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
   judged source, on Codex `gpt-6-sol` at `xhigh` or Claude Code
   `claude-opus-5-5` at `xhigh` (the operator's 2026-09-28 direction), and
   mints the feedback edition from it (the audit and
   `node scripts/feedback-evidence.mjs --record-selfhost`, as WO-147 D010
   records); the decisions file records which configuration ran. A repair
   that edits a judged source again runs another episode the same way. An
   unchanged `reactor.ts` meets the criterion.
4. Write-backs land: 06 §Application version pending — Pattern workshop
   v1, in place with no dated paragraph (its second paragraph names the
   compiled slice instead of wave 4; at most 200 bytes added, against
   1,802 bytes of headroom on 2026-09-28; WO-086, WO-087, WO-066, WO-061,
   WO-124, WO-112, WO-083, WO-096 and WO-098 also write 06, so the
   executor re-measures the headroom at its base; where the bound does
   not fit, it consolidates the section it edits in the same change; a
   ceiling is raised only by a planning-document decision); one sentence
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

**Non-goals:** drag-equip authoring; any console source change; a row
edited into the capability inventory.

**Operator-review assumptions**

1. The second scenario stands beside the frozen oracle.
