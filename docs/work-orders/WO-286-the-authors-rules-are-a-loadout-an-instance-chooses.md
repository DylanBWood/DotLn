# WO-286 — The author's rules are a loadout an instance chooses: every unit and shared rule says whether it is the platform's or the author's, an instance's overlay removes any of the author's, and one table shows which are on and whose they are (version assigned at activation)

**Umbrella record (2026-11-16):** superseded whole by WO-287, which carries
this order's obligations as its Part B under the operator's direction of
2026-11-16 ([the 2026-11-16 pass](../planning/passes/the-kit-stops-no-work-2026-11-16.md));
not activatable. The text below is this order's form as that pass filed it, kept
as the record of what WO-287 absorbed: its design, its observed gap, its
execution plan, its cost detail and its cited code are read from here; its
cost, its non-goals and its criteria are restated in WO-287; and where
the two differ WO-287's text binds.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-287",
    "relation": "superseded",
    "reason": "2026-11-16 planning merge: this order's obligations are carried by WO-287 as its Part B.",
    "by": "WO-287"
  }
]
<!-- dotln-dependencies:end -->

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Review ladder:** paired
**Release classification:** minor. Each feedback unit and each shared role
rule carries a layer, `platform` or `author`; an instance's build overlay
removes or restores any author-layer unit or rule by id, or all of them by
one name; the features page lists every unit and rule with its layer, how
it is enforced, whether this root equips it and the line that changes it;
the kit guide states which layer is whose. An instance that sets nothing
keeps the rules it has. No refusal is added. Assigned at activation under
the standing opt-out default.
**Cost:** adds a layer on thirty-four rule records and a reading of the
ten units' existing scope, the overlay's wider `equip` and `unequip`, the
filter in the configured program and in the launchpad's and a target
worktree's emit, the rule rows of the
features page and one section of the kit guide, with twelve to twenty
cases (estimates, not bounds). It removes the only route an owner has
today to decline one of the author's rules: dropping the whole bundle with
`build: "none"`, or editing an emitted file that the next emit overwrites.
`packages/skeleton/src/loadouts/contributor.ts` is a registered evidence
source: the editions it stales are re-minted with `npm run sync`. The
design reads the units' existing `scope` field so that no judged feedback
source changes; if the executor finds that
`packages/skeleton/src/loadouts/feedback.ts` or
`packages/compiler/src/feedback.ts` must change, the order owes the
feedback re-mint and one live feedback self-host episode after that step,
and its decisions say why. One complete review run at final review. Tokens
and steps are unknown until run.
**Nomination provenance:** the operator's messages of the 2026-11-16
planning dispatch: what the operator wants in this repository is not to be
taken for what the kit's and the starter's users want, and it is neither
plain which rules are the operator's alone nor can an instance change the
built-in ones (journal digest
`bfec526c5a181ab51d95b25df28c16700408dc88bfc7705eed55c2af9dc41f43`); and
the sentence of `README.md` the operator pasted, which calls this
repository's guardrails its author's own loadout (journal digest
`0ae2eb1060c0d43a089d330049e8273280deaf268eed1c88ca97960ae67c7055`).
Register rows allocated here: FUP-0082 (the owner-sovereign profile,
deferred on 2026-09-19 until a second owner existed, which the work
instance now is) and FUP-edefd92233980b63 (core-operator decisions marked
in kit text for an instance to decline, closed by WO-241 as a registry
field). Clean-room screen: core's own source and records; nothing from an
instance.
**Depends on:** as WO-287's Part B, on its Part A (the table of stops,
and `scripts/lib/features.mjs` and the kit guide's Features section as
that part leaves them).
**Recommended placement:** WO-287's Part B.
**Cites (read these sections):** ADR-0006
(`docs/decisions/0006-platform-mechanisms-instance-doctrine.md`), decisions
1 to 4 and 6; product 01's layer labels and product 03's boundary table
and its owner-sovereign candidate; `README.md`, the paragraph on whose
loadout the guardrails are; the census of this pass,
`docs/planning/passes/the-kit-stops-no-work-2026-11-16-doctrine-census.md`;
`packages/skeleton/src/loadouts/feedback.ts` (`personalFeedbackUnits`, the
units' `scope`); `packages/skeleton/src/loadouts/contributor.ts`
(`SharedRule`, `correctionRules`, `insertedRules`,
`contributorConfiguredProgram`, the roles' `feedbackHandlers`);
`scripts/lib/harness.mjs` (`harnessInstallation`);
`scripts/lib/build-overlay.mjs` (the `equip` and `unequip` validator);
`packages/compiler/src/harness.ts` (`lowerToHarness`, the role roots'
Origin comment and unit lines); `scripts/lib/features.mjs`;
`scripts/kit/CLAUDE.template.md`; `docs/KIT.md` §Features, §The build
overlay and §Kit files and instance files;
`docs/work-orders/WO-076-instance-build-overlay.md` (its recorded
reopening condition).
**Objective:** An instance's owner can see, in one generated table, every
rule the kit puts into a session's instructions, whether it is the
platform's (the lifecycle's own mechanics) or the author's (how the author
wants work conducted), how it is enforced and whether this instance equips
it; can remove any of the author's, or all of them, with one line of the
instance's overlay; and reads in the kit guide which layer is whose. An
update never restores a rule the owner removed, and an instance that sets
nothing keeps what it has.

**Observed gap (dated 2026-11-16 at `main` `38c333ab2`, v1.2.0):**

1. The split is an accepted decision. ADR-0006 (2026-09-03) puts operating
   policy, security posture, evidence standards, source treatment and
   workflow defaults with an implementation, not the platform (decision 1),
   keeps the author's loadout binding for this repository alone (decision
   3), admits an owner's own profile down to no DotLn policy at all
   (decision 4) and says the Clean Room rule is this repository's
   governance and no universal restriction (decision 6). `README.md` says
   the same of the guardrails in its own words.
2. Every instance receives the author's ten feedback units. Each carries
   `scope: ["personal-profile", "equipped-feedback-host"]`
   (`packages/skeleton/src/loadouts/feedback.ts` 29), which nothing reads;
   the emit compiles them unconditionally (`scripts/lib/harness.mjs` 246,
   `options.feedback ?? personalFeedback()`, where no caller passes
   another), and every role equips all ten
   (`packages/skeleton/src/loadouts/contributor.ts`, the roles'
   `feedbackHandlers`).
3. Thirty-four shared role rules ship as fixed text: records of an id, the
   roles and the sentence (`contributor.ts` 134 to 138; `correctionRules`
   152 to 216; `insertedRules` 777 to 847), with no field that says whose
   they are.
4. The build overlay's `equip` and `unequip` refuse any id that is not one
   of the ten supports, `names unknown support`
   (`scripts/lib/build-overlay.mjs` 84 to 89). WO-076 recorded when to
   reopen that: a fork needs a unit the switches do not name.
5. An owner who edits an emitted role root is refused by the harness
   check, `harness drift: <path>` (`scripts/lib/harness.mjs` 1118 to 1126),
   and the next emit writes the kit's text back. The one removal the kit
   offers is `build: "none"`, which drops every rule and hook together.
6. The kit's feature page calls the clean-room floor "Not electable"
   (`scripts/lib/features.mjs` 231 to 235) and the instance's seeded
   `CLAUDE.md` heads its section "locked floor"
   (`scripts/kit/CLAUDE.template.md` 10), against decision 6.
7. The documents that state the split stay in core: an instance receives
   neither ADR-0006 nor product 01 or 03 (the doctrine census, §1.4).
8. The record shows the request narrowed three times to something smaller:
   on 2026-10-07 "unequip units" was read as the existing support switches;
   on 2026-10-30 the operator's item on operator-specific and core-specific
   loadouts was read as a `scope` field in the feature registry; on
   2026-11-03 WO-241's final review discharged the carry-in as that field.
   The two follow-ups that would reopen it waited on a second owner
   (FUP-0082) and on WO-207 and WO-096 closing (FUP-edefd92233980b63), and
   both of those orders are in "Not now" (the doctrine census, §5).

**Design (scope discipline):**

- A layer is a fact about a rule, written where the rule is defined. A
  shared rule record gains `layer: "platform" | "author"`. The test is
  whether a session can still operate the lifecycle without the sentence:
  a rule that says how a kit command or record works is `platform`; a rule
  that says how a session should conduct itself, or how the author wants
  work done, is `author`. Each record's layer is given with a reason of
  one line in the order's decisions, for the operator to read and change.
  The ten units are `author`: their `scope` already says personal profile,
  and the configured program reads it. A role's numbered steps and the
  commands they name are `platform` and are not units of choice here.
- The overlay's `equip` and `unequip` accept a unit's id, an author-layer
  rule's id and the name `author`, which stands for every author-layer
  unit and rule. An unequipped unit is absent from every role root, its
  hook is not registered and its advisory at Stop is not given; an
  unequipped rule's sentence is absent. A platform-layer id in `unequip`
  is named in one advisory and kept; in an instance an unknown id is named
  in one advisory and ignored. Rejected: a new file or section for this
  choice (axis: one place; the overlay already equips and unequips, and
  WO-076 recorded this as its reopening).
- A unit that also refuses is two things. The writer reservation and the
  attribution rule each have a sentence in the role text, which is the
  unit, and a refusal, which is a row of WO-285's table. Unequipping the
  unit removes its sentence and its advisory, and its refusal goes with
  it: the stop reads `off` while the unit is unequipped, and a `stops`
  line that asks otherwise for it is advised as a line with no effect.
  The attribution setting the emit writes into the host's settings is
  written only where that unit is equipped, as the launchpad's settings
  already are (`packages/compiler/src/harness.ts` 1602) and a target's
  are not (1950).
- A target worktree's bundle follows the same selection. Today
  `emit --target` does not read the overlay, compiles the whole feedback
  program for the target and requires the writer and attribution units
  (`scripts/harness.mjs`; `emitTargetUnlocked` in `scripts/lib/harness.mjs`;
  `lowerTargetWorker` in `packages/compiler/src/harness.ts`), so a rule an
  owner removed would stay in every sibling repository.
- The default changes nothing: with no such id in its overlay an instance
  emits the units and rules it emits today, so taking the release moves no
  session's instructions. Rejected: a new instance starting without the
  author's layer (axis: evidence; nobody has yet said which of these rules
  an owner other than the author wants, and removing them unasked is as
  much a guess as imposing them; the table and the one line make the
  choice the owner's on the first day).
- The features page gains the rule table: id, layer, how it is enforced
  (a sentence in the role's text, an advisory, a hook), whether this root
  equips it, and the overlay line that changes it. It replaces the
  sentence that the clean-room floor cannot be chosen: the Clean Room and
  Secrets sections of an instance's `CLAUDE.md` are the owner's own text,
  and the seed's heading and the kit guide say so.
- The kit guide gains one section that states the two layers in the
  owner's terms, from ADR-0006: what the kit provides as mechanism, what
  arrives as the author's choices, and how each is changed. It ships to
  every instance; core's ADR stays where it is and is linked from core's
  own pages alone.
- The harness check judges an instance against its own emit, as it does
  for the supports, so an owner who unequips a rule is not told of drift.

**Execution plan (the executor follows these steps in order; observed at
`38c333ab2`, 2026-11-16).** A step's check is one case run under
`node scripts/harness.mjs bounded -- node --test --test-name-pattern`; no
suite runs alone before the order's one complete run except to reproduce a
failure that run names.

1. `packages/skeleton/src/loadouts/contributor.ts` (`SharedRule` gains
   `layer`; each record of `correctionRules`, `insertedRules` and the two
   named rules is given one; `contributorConfiguredProgram` leaves out an
   unequipped unit's handler and an unequipped rule's sentence, reading
   each unit's `scope`). Check: a case in `scripts/test-harness.mjs` that
   the configured program for an overlay naming one unit and one rule
   carries neither.
2. `scripts/lib/build-overlay.mjs` (the `equip` and `unequip` validator
   accepts unit ids, author-layer rule ids and `author`; the advisories of
   the Design). Check: a case in `scripts/test-configuration-root.mjs` for
   each accepted id, a platform-layer id and an unknown id.
3. `scripts/lib/harness.mjs` (`harnessInstallation` compiles the feedback
   program from the equipped units and passes the equipped rules) and
   `packages/compiler/src/harness.ts` (`lowerToHarness` writes no line and
   registers no hook for an absent unit); for a target worktree,
   `scripts/harness.mjs` (`emit --target` reads the overlay),
   `scripts/lib/harness.mjs` (`emitTargetUnlocked` compiles the owner's
   selection) and `packages/compiler/src/harness.ts` (`lowerTargetWorker`:
   the two units it requires, and the attribution setting it writes
   whatever the units are). Check: a case in
   `scripts/test-harness.mjs` that an emit under `"unequip": ["author"]`
   writes role roots whose Origin comment names no author-layer unit and
   settings that register no hook of one.
4. `scripts/lib/features.mjs` and `scripts/features.mjs` (the rule rows).
   Check: a case in `scripts/test-features.mjs` that the list names every
   unit and rule with its layer and whether this root equips it.
5. `scripts/kit/CLAUDE.template.md` (the section's heading and one
   sentence that the text is the owner's). Then
   `node scripts/harness.mjs emit` and `npm run sync`. Check:
   `node scripts/harness.mjs check`.
6. Write-backs: `docs/KIT.md` §Features (a new subsection, "What is the
   kit's and what is the author's", and the rule table's meaning) and §The
   build overlay (the wider `equip` and `unequip`, with an example that
   removes the author's layer); product 03, the owner-sovereign candidate
   (what this order delivers of it and what stays a candidate); the
   regenerated `docs/control/FEATURES.md`;
   `docs/evidence/WO-286/decisions.md` (each rule's layer and reason) and
   the regenerated decisions index. Then the handoff sequence of product
   07 §Discipline.

**Deliverables:** the layer on every shared rule; the overlay's wider
lists; the filtered program and emit; the features page's rule rows; the
seed's wording; the kit guide's section; the decisions with each rule's
layer and reason; regenerated roots and editions.

**Acceptance criteria (all required)**

1. `npm run features -- list` prints one row for each feedback unit and
   each shared role rule with its id, its layer, how it is enforced,
   whether this root equips it and the overlay line that changes it
   (`npm test -- --only configuration-root`).
2. With `"unequip": ["author"]` in an instance's overlay, the emitted role
   roots carry no author-layer unit's line and no author-layer rule's
   sentence, the emitted settings register no hook of an author-layer
   unit, and every role's numbered steps and every platform-layer rule
   remain (`npm test -- --only harness-fixtures`).
3. An overlay that names single ids removes or restores exactly those; a
   platform-layer id in `unequip` is named in one advisory and kept; in an
   instance an unknown id is named in one advisory and ignored
   (`npm test -- --only configuration-root`).
4. With no unit or rule id in its overlay, an instance's emitted role
   roots name in their Origin comments the unit ids they named at the
   order's base and carry every shared rule's sentence
   (`npm test -- --only harness-fixtures`).
5. `node scripts/harness.mjs check` passes in an instance whose overlay
   unequips author-layer rules, and a later emit leaves them absent
   (`npm test -- --only harness-fixtures`).
6. The features list prints no line saying the clean-room floor cannot be
   chosen; an exported instance's `CLAUDE.md` says its Clean Room and
   Secrets sections are the owner's own text, and its kit guide has the
   section that states which layer is whose
   (`npm test -- --only launchpad`).
7. Each shared rule's layer and its one-line reason are in
   `docs/evidence/WO-286/decisions.md`.
8. With the attribution unit unequipped, or `author`, an emit into a
   registered target worktree writes no attribution setting and registers
   no attribution hook, its check passes, and the writer reservation there
   still answers at its stop's level (`npm test -- --only target-worktree`).
9. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`, `npm test -- --only
configuration-root`, `npm test -- --only launchpad`, `npm test -- --only
target-worktree`, `npm test -- --only
harness-evidence`, `npm test -- --only authority-evidence`, `npm test --
--only artifact-evidence` and `npm test -- --only verification-evidence`,
whose rows the order's one complete run supplies; the structural phase;
the complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-286/`: the features list of
core and of an instance fixture; an emit under `"unequip": ["author"]`
with the role roots' Origin comments; the harness check's output for that
instance. No status capture is asked for: it holds the worktree's absolute
path (WO-277-D014).

**Write-back duty:** as step 6 lists; the release's Read before upgrading
says that nothing changes for an instance that sets nothing, where the
table of rules is, and the one line that removes the author's layer.

**Known issues and carry-ins:**

- The line between a platform rule and an author rule is a judgment for
  thirty-four records. The order records each with its reason; a record
  the operator moves at the pull request is changed in the same order.
- Removing a rule's sentence does not remove a check that enforces the
  same thing elsewhere (the document gate's verbatim screen, the terms
  screen, the lifecycle's completion checks). Those are stops, and WO-285's
  table lists and lowers them.
- A role's numbered steps, the review ladder and the three reviewers are
  the author's workflow by ADR-0006's first decision and stay fixed here.
  An instance that asks to change one reopens that.
- Until WO-278 lands, this order's first round is launched as WO-276-D118
  records.

**Non-goals:** changing which rules core equips; rewriting any rule's
text; a new instance without the author's layer; replacing a rule's text
from an instance (removal and restoration only); the role steps; a second
loadout.

**Operator-review assumptions:** an instance keeps the author's rules
until its owner removes them, so that no instance changes by taking the
release, and the choice is made visible by the table and one line instead
of by a different default; the layer of each rule is the executor's
recorded reading, for the operator to correct; the seeded Clean Room and
Secrets text is the owner's to edit, as decision 6 of ADR-0006 says.
