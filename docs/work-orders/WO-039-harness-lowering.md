# WO-039 — Harness lowering: compile a saved build into enforceable harness configuration, and run this repository on its own compiled build (v0.15.0)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the compiler and fixtures. The live smoke and
the self-host step need the actual local harnesses (Claude Code; Codex where
installed) and must state the harness version, model, and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It adds a separate compiler contract
(`harness-v1`), a skeleton loadout and lowering host, a `harness` command, and
generated project-scope harness configuration; no kernel change and no change
to the loadout, feedback, or verification contracts. Assigned at activation
under the standing opt-out default (06-roadmap.md §Release boundary).
**Nomination provenance:** the 2026-09-06 phase-two redirect, from the
operator's correction of the first phase-two pass ("the whole idea is that i
take the ... hand crafted rules from the v1 app ... and somehow they become
skills or hooks or the ENTIRE CONCEPT OF DOTLN ITSELF") and the founding
north star's axioms that hard constraints live outside the model in
permissions and hooks and that prompt fragments are a last-mile artifact
(ledger §Chat 001, §Notes 001; synthesized, nothing copied). It lowers the
architecture's "agent enablement skills" section, which has had no order since
it was written. Planner-synthesized draft; the operator's correction is
preserved locally as a compaction-safety capture. Opaque identifier, not a
priority. The clean-room screen found no employer, credential,
internal-service, or other stop condition: the predecessor's rule files are
not an input to this order and never enter this repository.
**Depends on:** WO-011 merged (the ten compiled units and `feedbackBoundary`;
satisfied at `v0.13.0`); WO-008 merged (compiler v1; satisfied at `v0.4.0`);
WO-029 merged (artifact identity per component; satisfied at `v0.9.0`);
WO-001 and WO-004 merged (the environment-truth method this order extends to
hooks and skills; satisfied at `v0.2.1`).
**Recommended placement:** wave 1, lane A, beside WO-032, with which it shares
no primary write surface. Phase 1 and the self-host step are the fork-binding
minimum: WO-033's export carries this order's bundle, and the first external
fork of the starter is expected within about a week of the redirect. A
recommendation, not a dependency token.

**Cites (read these sections):** 00-vision.md §The one-paragraph story ("a
build, not a biography") and §Mission; 02-domain-model.md §Feedback
(FeedbackUnit, the mechanism hierarchy: rung 2 permission or pre-effect
guard, rung 7 on-demand skill, rung 8 task-local fragment, rung 9 globally
loaded prose) and §Identity and composition (LoadoutGraph, AuthorityEnvelope,
Phenotype); 03-architecture.md §Agent enablement skills (the runtime profile,
capability negotiation, the minimal native skill bundle, the incremental
delivery order: intent-to-transition contract, then verifier and repair
skills, then final-review and lifecycle skills, then measurement) and
§Platform and instance boundary; 04-interfaces.md §Candidate — exact operator
command vocabulary; 07-execution-guide.md §Operator resume phrases (the
machine contract every skill must preserve) and §Discipline (no config
mutation of safety boundaries without work-order authority; this order
authorizes exactly the mutation named below); 01-principles.md Principles 5,
7, 15, and 16; ADR-0003, ADR-0004, ADR-0005 (the posture the generated
configuration must never loosen); ADR-0002 Amendments (dependency posture);
`docs/discovery/environment.md` (hooks "documented locally", skills "not
found", no `hooks` key) and `docs/discovery/codex-runtime-map.md` (skills
documented and untested, hooks observed and untested); `docs/README.md`
§Config log; `packages/compiler/src/feedback.ts`, `compile.ts`, `render.ts`;
`packages/skeleton/src/feedback-boundary.ts`, `loadouts/feedback.ts`,
`loadouts/entropy-reducer.ts`; `scripts/feedback-commit-msg.mjs` (the one
existing hook adapter, whose shape this order generalizes); `.claude/settings.json`
and `CLAUDE.md`.

**Objective:** Make a saved build govern the sessions that actually run. Add a
pure compiler target that lowers a loadout, its equipped feedback units, and
its authority envelope into the configuration a harness enforces: settings
permissions and hook scripts at rung 2, on-demand role skills at rung 7, and a
generated instruction fragment at rung 8 that holds only the residue nothing
lower could carry, with a byte count. Then define this repository's own
session build, the **Contributor**, emit its harness configuration from the
compiler, commit the result, and refuse drift in the evidence gate, so that
core runs on its own product and not only on its own process.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- The ten compiled units are hard only inside the equipped feedback host that
  `dotln feedback-audit` runs. No session the operator opens in this
  repository is governed by them. Those sessions are governed by `CLAUDE.md`
  (66 lines, 2,870 bytes), the execution guide (804 lines), and the playbook,
  which is rung 9 of the repository's own mechanism hierarchy.
- `.claude/settings.json` holds one key. There are no project hooks and no
  project skills; the only hook adapter is `scripts/feedback-commit-msg.mjs`,
  installed by hand in a selected host. The discovery record says hooks are
  documented locally and skills are absent; neither has been smoked here.
- The architecture's "agent enablement skills" section specifies resume
  phrases that load only the reviewed role skill for the intent and names an
  incremental delivery order. No work order has ever been filed for it.
- The 2026-09-06 documentation sweep measured a cold start of about 1,300
  mandatory lines and projected more than 2,000 in six months. That is the
  predecessor's startup-context failure re-created in a different shape.
- WO-033's export cannot ship an actor until a build can be lowered to
  something a fork's harness enforces.

**Design (scope discipline):**

- **Phase 0 — harness truth (bounded).** Before any lowering rule is written,
  smoke the actual local harnesses the way WO-001 smoked transports: one
  PreToolUse hook that refuses a fixture command, one PostToolUse hook that
  observes an edit, one Stop hook, one UserPromptSubmit hook, and one project
  skill resolved by name; for Codex where installed, the documented
  repo-local skills root and hooks. Record in
  `docs/discovery/harness-smoke-2026-MM-DD.md` and its JSON projection: the
  harness version, which events fired, the payload fields each hook actually
  received (field names and value shapes; absolute paths, session ids, and
  host names are reduced to shapes such as `<cwd>` and `<session>` before
  the record is committed, per 09 §Privacy and minimization), how a refusal
  is expressed and whether the harness honored it, what `--bare` skipped,
  and what remained unobserved. Every later claim in this order cites a row
  of that record; an unobserved capability is declared unavailable in the
  profile, never assumed.
- **The local-terms check (small, shared).** Generated text is a committed
  surface, so this order adds `scripts/lib/terms.mjs` and
  `npm run terms -- check <paths>`: it reads an operator-maintained
  plaintext list of terms that must not enter committed files from the
  ignored local directory the control plane already reserves
  (`docs/control/local/terms.txt`, never committed, never hashed into any
  committed file), normalizes each committed line into tokens and adjacent
  token pairs with separators removed, and refuses a match; when the local
  list is absent it reports `unavailable` and says so in `npm test` rather than passing
  silently. The list grows as the operator identifies terms; it is not an
  exhaustive inventory required before work can proceed. When no terms are
  known, leave the list absent and report that state without blocking readiness.
  The locked Clean Room boundary still applies. This follows the operator's
  2026-09-07 correction recorded in the ideation receipt below.
  A refusal prints only the file, the line number, and a count,
  never the matched text, so a refusal echoed into a transcript that is
  later committed as evidence cannot republish the term the check exists
  to keep out. Nothing about the terms is ever committed, so there is no
  list to reverse; a fork registers its own local list. The fixture uses a
  synthetic term registered in a fixture-local list. This order runs
  it over every generated skill, the residue block, and the discovery
  record; WO-033, WO-034, and WO-040 consume it.
- **Phase 1 — the `harness-v1` contract and lowering.** In the pure compiler:
  `HarnessProfile` (harness id, observed version, capabilities as observed in
  phase 0: hook events and refusal semantics, skills root, settings
  permissions shape, instruction file) and
  `lowerToHarness(program, feedback, envelope, profile) → HarnessBundle`. The
  bundle is data: files `{ path, contents, origin, rung }` where `origin`
  names the unit or facet id and the loadout's semantic hash; a
  `harness-manifest.json` with per-file hashes, compiler package version,
  profile, and loadout identity; and a `residue` report listing every unit or
  facet that could not lower below rung 8 with the reason. Lowering per
  declared mechanism: a `permission-guard` becomes a settings deny or allow
  entry plus a PreToolUse hook that re-checks the host facts a settings
  matcher cannot express; `writer-isolation` becomes a PreToolUse hook on
  shell, edit, and write tools that resolves cwd, Git root, and the worktree
  registry; `suppression-diff` becomes a PostToolUse hook on edit and write
  tools; `attribution` becomes the existing commit-message hook plus a
  PreToolUse check on commit commands; `application-evidence`,
  `complete-scope`, and `output-review` become a Stop hook that consults the
  control state's required checks, obligations, and read receipts and refuses
  a completion claim the lifecycle script would refuse anyway (defense in
  depth; `resume.mjs` stays the ground truth); `decision-lineage`,
  `evidence-judgment`, and `cleanup-scope` become role skills at rung 7 with
  the boundary check applied where the host fact exists; `semantic-correction`
  lowers to a UserPromptSubmit hook that types `OperatorCorrectionReceived`
  from an exact operator-supplied token and nothing else, then injects the
  compiled fail-conservative response as context. Surface language is never a
  trigger. Every generated hook script imports the pinned built
  `feedbackBoundary` and evaluates the same compiled unit with the facts the
  hook computes; there is no second predicate. Role skills are generated
  `SKILL.md` files, one per resume-phrase role (planner, executor, verifier,
  reviewer, release close), carrying procedure, input contract, artifact
  locations, evidence obligations, and stopping rules, and duplicating no
  phase state and granting no authority, exactly as 03 specifies. The
  instruction fragment is a generated block between
  `<!-- dotln-harness:start -->` and `<!-- dotln-harness:end -->` markers in
  the instruction file, holding the residue and its byte count; the
  hand-written clean-room floor stays outside the markers. Lowering is pure,
  deterministic, and dependency-free; a changed unit changes only the files
  that name it. The residue block is bounded: it may hold only text that no
  unit or facet lowered below rung 8, each residue line names the unit or
  facet it came from, and the emitter refuses a residue that restates
  procedure a generated role skill already carries.
- **Phase 2 — the Contributor build and the self-host.** Add
  `packages/skeleton/src/loadouts/contributor.ts`: the identity that works
  this repository, with four roles selected by resume phrase, the ten
  personal units equipped, the Clean Room active with its locked floor, and an
  authority envelope that states the ADR-0003 through ADR-0005 posture as
  allowed and denied effect patterns. Add `npm run harness -- emit
  [--loadout <id>] [--profile <id>] [--out <dir>]` and
  `npm run harness -- check`, which compares an installed `.claude/` (and
  `.agents/` where the profile has one) against the emitted bundle and
  refuses drift. Emit the Contributor bundle into this repository's
  `.claude/` and the marked block of `CLAUDE.md`, commit it through the
  ordinary pull request, add `harness check` to the root `npm test`, and
  record the change in the config log. Measure the startup context before and
  after under each role with the WO-004 and WO-011 accounting methods (file
  bytes and lines; instruction bytes), including the mandatory cold-start
  read the execution guide names.
- **Phase 3 — the Codex profile.** From the phase 0 record: an `AGENTS.md`
  block through the existing symlink, the documented repo-local skills root,
  and hooks only if observed; every unobserved capability appears in the
  residue as unavailable with the exact missing capability, in the shape the
  senses use for a missing mount.
- **Authority of this order over safety boundaries.** This order authorizes
  exactly one configuration mutation: project-scope `.claude/settings.json`
  permissions and hooks, project skills, and the marked instruction block, all
  generated by the compiler and reviewed in the pull request. A generated
  allow entry can never exceed the build's envelope; a generated deny can
  only tighten. User-scope settings, the sandbox controls, the credential
  denials, and every ADR-0003 through ADR-0005 decision are untouched, and a
  dated ADR-0005 amendment records that project-scope harness configuration
  is now compiler output.
- **Declined alternatives, recorded:** hand-writing hooks for the ten units
  (a second behavior system the compiler cannot see; the vision's exact
  failure); detecting corrections from wording (rejected by 02 §Semantic
  correction events); a user-scope install (the build belongs to the
  repository and travels with the export); publishing packages so hooks can
  import them (the built modules already exist in this repository, and the
  export question is WO-033's).

**Deliverables:** the phase 0 discovery record; the local-terms check; the
`harness-v1` contract,
`lowerToHarness`, and its fixtures in `packages/compiler`; the generated hook,
skill, and fragment emitters and the `harness` command in the skeleton and
`scripts/`; the Contributor loadout; this repository's committed generated
harness configuration with `harness check` in `npm test`; the startup-context
measurement; the write-backs below.

**Acceptance criteria (all required)**

1. The phase 0 record exists for the local Claude Code harness and, where
   installed, Codex, with observed hook events, payload fields, refusal
   semantics, skill resolution, and what remained unobserved; every profile
   capability the compiler consumes cites a row of it.
2. `lowerToHarness` is pure, deterministic, and dependency-free; the bundle's
   manifest hashes verify; every emitted file names its origin unit or facet
   and the loadout's semantic hash; each of the ten units lowers to its
   declared rung or appears in the residue with a reason; a fixture proves
   that changing one unit changes only the files that name it and that the
   Seiri and Entropy Reducer programs keep their exact semantic hashes.
3. For each generated hook, a fixture invokes it with a synthetic payload and
   proves its allow or refuse decision equals `feedbackBoundary`'s verdict on
   the same host facts, and that removing the unit makes the hook allow.
4. A recorded live smoke in a scratch checkout carrying the emitted bundle
   shows the actual harness refusing at least one denied effect through a
   generated hook and resolving one role skill by resume phrase; when the
   operator has confirmed the correction token, the smoke also types one
   correction event from it, and when the token is unconfirmed the smoke
   shows the correction unit reached through its role skill and the residue
   report names the unconfirmed token as the reason. The smoke also records,
   through a generated read-observing hook that runs for the whole smoke
   session under each role, every file the session actually read, and
   compares that set with the directed-read set criterion 6 derives: a read
   outside the directed set plus the active order's own cited sections
   fails this criterion and is named in the residue report, whether it
   happened before the first effect or after the last resume command, so a
   skill that merely suggests the guide while the session reads it anyway
   cannot pass. The transcript names harness version, model, and effort.
5. This repository's committed `.claude/settings.json`, hooks, skills, and the
   marked `CLAUDE.md` block are byte-identical to `harness emit` for the
   Contributor build; `harness check` runs in `npm test` and fails on a
   one-byte drift fixture; the config log has the entry; ADR-0005 carries the
   dated amendment; no user-scope file changed.
6. The startup-context measurement is directional and counts everything
   the session is directed to load: for a cold start under each of the four
   roles, the after value is the sum of the whole instruction file (the
   hand-written floor and the marked residue block alike), the generated
   role skill's bytes as loaded by the resume phrase, and **every file that
   either the instruction file or the skill directs the session to read
   anywhere in the role's procedure**, before acting or at any later step,
   including any read order the floor still states; the
   before value is the activation base's whole instruction file plus every
   file its §Start here read order and the execution guide's role procedure
   directed for that role. The after value is strictly lower in bytes and
   lines for every role, and the instruction file alone is strictly lower
   than the activation base's; the method is stated, and a fixture derives
   the directed-read set mechanically from the instruction file and the
   skill rather than from the executor's list. The floor's read order is
   rewritten so that, per role, it names the role skill and only files the
   measurement counts; a read the floor directs that the measurement does
   not count fails this criterion. Relocating guide text into a skill counts
   in the after value and therefore cannot satisfy this criterion on its
   own; a role that is not lower fails this criterion and the residue
   report names what kept it long. The build replaces the biography for
   that role; it is not placed beside it.
7. Write-backs land: 02 §Feedback (the `harness-v1` contract, its lowering
   table, and the residue rule); 03 §Agent enablement skills (the first slice
   shipped and what remains of the delivery order); 07 §Operator resume
   phrases and §Read order for a cold start, and `CLAUDE.md` §Start here
   (phrases load the generated role skill; the cold-start read order names,
   per role, the skill and only the files criterion 6 counts); 13 engineer
   and
   devops rows; README "What runs today"; dated capability-table rows for
   `compiler.harness-v1` and `harness.self-hosted`; publication index rows and
   both edition locks; ledger entry.
8. `npm test` green; `git diff --check` clean; no new runtime dependency (the
   hooks import built modules already in the repository; the recorded
   TypeScript parser dependency is unchanged); kernel unchanged; the
   local-terms check has run over every generated skill, the residue block,
   and the discovery record, reporting whether the operator's list is present
   or unavailable. A present list must pass; no known terms and an absent list
   are an explicit unavailable state, not a readiness blocker or a claimed
   passed screen. Its synthetic-term fixture refuses. This replaces the
   original list-present-only condition under the operator's 2026-09-07
   correction; neither an exhaustive inventory nor invented entries are required.

**Evidence gate:** the discovery record; the fixture transcripts for
criteria 2 and 3; the smoke transcript for criterion 4; the drift fixture for
criterion 5; the measurement for criterion 6; `npm test`.

**Write-back duty:** as listed in criterion 7.

**Non-goals:** compiling units beyond the ten (WO-040 migrates the rest in
batches through this target); the starter export and the fork's profile
(WO-033); Codex lowering beyond what phase 0 observed; user-scope settings;
loosening any ADR-0003 through ADR-0005 control; a general effect-to-tool
table for every harness (the profile declares what this harness has); a hook
that reads model output or operator wording for sentiment; the actor board
(WO-032); changing lifecycle legality or the event schema.

**Operator-review assumptions**

1. The exact correction token is the operator's to supply; the planner's
   candidate is `correction:` in the shape of the recorded `analysis:` token.
   Until it is confirmed, the semantic-correction unit lowers to a role skill
   at rung 7 and the residue says why.
2. Project-scope harness configuration is committed and reviewed like code;
   nothing is written to user scope.
3. The executor session for this order runs under the current hand-written
   configuration until the self-host step lands, and discloses that
   self-referential instrument in its result.
4. If phase 3 finds Codex hooks unobservable here, the Codex profile ships
   with skills and the instruction block only and says so.

## Ideation breakout — incremental private list and future UI (2026-09-07)

The operator corrected the up-front list requirement, explicitly opened ideation
for a future UI to inspect, add and remove entries, and then authorized an initial
private seed. This expands the documentation subject while preserving the
existing implementation. The [breakout receipt](../evidence/WO-039/ideation.md)
names the canonical ignored capture, synthesized ledger entries, changed product
surfaces, open UI choices and required independent review. The future UI is an
unallocated candidate; no UI implementation or additional work order is activated.
