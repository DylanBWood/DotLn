# WO-096 — Migration ledger and whole-set classification: every feedback shape the operator named gets a typed row or an exclusion count, the ten compiled units are marked, governance mode is derived by one rule, and the render is checked with the local-terms screen (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** patch. A generated projection over typed rows
and its check; no unit compiled here. Assigned at activation under the
standing opt-out default.
**Cost:** adds the typed rows `corpus/feedback/migration.json`, a renderer
and check (one new script), the render
`docs/lineage/feedback-migration.md`, a `feedback` script in the root
`package.json`, one line in `corpus/README.md`, and at most 200 bytes in
product 06. Removes nothing that runs today: no row, render or check
exists. It unblocks WO-097, which depends on it. Re-mints: deterministic,
each edition the root `package.json` stales; the authority,
artifact-identity and verification editions register it
(`scripts/lib/evidence-sources.mjs`), while the feedback edition binds the
subject its verifier judged, which excludes the root `package.json`, so it
is neither re-minted nor carried; no live episode. The order expects to
edit no other registered source: `scripts/feedback-evidence.mjs` and
`scripts/lib/terms.mjs` are read, not edited, and an edit to either owes a
re-mint of each edition it stales. Wall-clock, tokens and context bytes
are unknown until run.
**Nomination provenance:** WO-040's migration-ledger and classification
items, cut into a bounded child at the operator's 2026-09-08 correction.
Amended by the 2026-09-28 planning pass, which re-observed the order on
`main` at `5f3849ec`: the row shape and the governance rule are stated
here, corrected to the four prose-kind units and the five refusals, the
always-on set is declared, the WO-053 deferral is met, the executor
counts the denominator, the re-mints and both gates are named, and
register row FUP-0025 (rule migration batch one, allocated to WO-096 to
WO-098 and WO-113) is carried here
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10). Planner-synthesized draft. Opaque identifier, not a priority.
Clean-room screen: applies with force; employer-specific shapes get no row.
**Depends on:** WO-011 merged (the ten units; closed, `v0.13.0`); WO-039
merged (the harness target and the local-terms check; closed, `v0.15.0`).
The dated planning deferral on WO-053 is met: WO-053 closed at `v0.29.3`.
**Recommended placement:** in the serial run, directly after WO-083, first
of the migration children. This order adds
`corpus/feedback/migration.json`, its renderer and check,
`docs/lineage/feedback-migration.md` and a `feedback` script in the root
`package.json`, and edits product 06, `corpus/README.md` and the decisions
file; WO-083 before it and WO-098 after it also write product 06. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-011",
    "relation": "satisfied-by-release",
    "release": "v0.13.0",
    "reason": "the feedback contract and the ten units"
  },
  {
    "workOrderId": "WO-039",
    "relation": "satisfied-by-close",
    "reason": "the harness target the batch lowers through and the local-terms check"
  },
  {
    "workOrderId": "WO-053",
    "relation": "planning-deferral",
    "date": "2026-09-08",
    "reason": "a real external episode is a better classification input than another corpus pass",
    "until": "WO-053"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 02-domain-model.md §Feedback (the
mechanism hierarchy) and §Feedback compiler v1 (the current harness policy
and the four prose-kind units); 00-vision.md §The one-paragraph story;
03-architecture.md §Corpus policy; `corpus/README.md`;
`docs/lineage/idea-ledger.md` §Notes 001 (the founding inventory);
`packages/skeleton/src/loadouts/feedback.ts` (`personalFeedbackUnits`);
`packages/compiler/src/feedback.ts` (the handler vocabulary and the unit
bound); `.claude/harness-manifest.json` (per-profile residue); `CLAUDE.md`
(the generated block); `scripts/lib/harness-context.mjs` (`directedReads`);
`scripts/feedback-evidence.mjs`; `scripts/lib/terms.mjs`;
`scripts/lib/evidence-sources.mjs`; `scripts/lib/document-gate-stubs.mjs`;
`.gitattributes`; `docs/work-orders/WO-040-rule-migration-batch-one.md`
(history: the umbrella's rules, stated below as they now hold); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** One row per shape (generic id, taxonomy category, cheapest
sufficient rung, status, governance mode derived by the rule the Design
states, a synthesized source note citing the ledger); employer-specific
shapes as a count per exclusion class with no row; the denominator pinned
to the intake capture's hash, counted by the executor; the
ten units marked `compiled`; `npm run feedback -- migration` renders the
projection; `--check` refuses a stale render, a compiled unit missing from
the rows, a `mechanism` row whose retired sentence is present, and any row
text matching the local-terms list (`unavailable` when the list is absent);
batch 1a and 1b candidates named.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The Contributor build equips ten units. Four declare
  `mechanism.kind: prose` with advisory enforcement (anti-oscillation,
  bounded-boy-scout-cleanup, correctness-over-sycophancy,
  fail-conservative-correction), the three Stop-time units advise, and the
  hooks of the six hook-lowered units do not fire under the Codex profile,
  whose residue carries them as role text. The generated instruction block
  names five refusals and calls every other tool and completion judgment
  advisory. Compiled no longer means governed by mechanism.
- Each role skill carries one generated line per unit, and no role reads
  the guide whole: a role reads the product 07 sections its skill's `Read`
  directives name, so "the guide's always-on portion" has no definition in
  the repository.
- The only public count of named shapes is the vision's "roughly 140
  accumulated feedback rules"; the exact denominator is in ignored intake.
- No rows file, render or check exists; the root `package.json` has no
  `feedback` script; `corpus/README.md` lists the corpus lanes, and
  `feedback/` is not among them.
- The compiler admits at most ten units, one per handler, from a closed
  vocabulary of ten handlers (`packages/compiler/src/feedback.ts` lines
  11–22, 102–105 and 196–199 at `5f3849ec`), so the twelve candidates this
  order names cannot compile without a contract change (WO-097, WO-098).
- Product 06 holds 90,074 non-exempt bytes under a ceiling of 91,876 at
  `5f3849ec`; WO-086 and WO-087 restructure it earlier in the sequence,
  and the executor re-measures at its base.

**Design (scope discipline):**

- The rules below are the row contract, stated here from WO-040 and
  corrected to the repository at `5f3849ec`; nothing is copied from any
  predecessor file.
- **Rows.** One row per shape: a generic `shapeId`; its taxonomy category
  (`invariant`, `reactor`, `evaluator`, `transformer`, `workflow`,
  `knowledge`, `preference`, `incident`, `obsolete`); the cheapest
  sufficient rung of the mechanism hierarchy (02 §Feedback); its status
  (`compiled` with the unit id, `batch-N` with its batch, `reference` for
  knowledge that stays an on-demand reference, or `declined` with a
  reason); its governance mode, derived; and a one-line synthesized source
  note that cites the idea ledger, never intake. A shape an existing check
  already enforces (WO-063's outward-artifact lint, for one) is `compiled`
  against that order, and the governance rule reads that check in place of
  a unit.
- **Exclusions.** A shape that describes an employer's tracker,
  environment, login, team or project gets no row: the file carries only a
  count per exclusion class (`excluded.employer-specific: N`), with no
  name, reason or paraphrase, and the operator's classification of those
  shapes stays in ignored intake. A shape is generalized to a public class
  only where a generic shape exists with no employer detail; its row says
  it was generalized and nothing more.
- **Denominator.** How many shapes the operator's intake names cannot be
  verified from committed files. The executor, which reads every shape of
  the capture to classify it, counts them: the rows pin the SHA-256 of the
  capture the ledger section of its date names, the receipt discloses the
  count as read by the executor from ignored intake, and rows plus
  exclusion counts equal that count.
- **Governance mode is derived, never classified, by one rule.** A
  `reference` or `declined` row is `none`. A row is `mechanism` only when
  its unit is equipped in the Contributor build, declares no
  `mechanism.kind: prose`, and no hand-written sentence restating it
  remains in the always-on set; every other row is `prose`, so the four
  prose-kind units derive `prose`. The always-on set is what a role loads
  before acting: the instruction file outside its generated block, the role
  procedure and support text the role skills carry, and the product 07
  sections their `Read` directives name (`directedReads`). The line the
  compiler generates for each unit in the role skills, and the unit's
  residue lines, are its lowering, not a restatement.
- **What `mechanism` claims.** An executable handler, not a refusal: the
  build's hard enforcement is the five refusals the generated instruction
  block names, and every other tool and completion judgment is advisory
  (02 §Feedback compiler v1). Where a harness profile's residue carries a
  `mechanism` row's unit as role text (Codex, for the six hook-lowered
  units at `5f3849ec`), the render names that profile beside the row.
- **Render and check.** `npm run feedback -- migration` renders the rows
  with counts per status and per governance mode and states the two points
  above beside the counts; the renderer resolves the `lineage` root through
  `scripts/lib/config.mjs`. `--check` refuses a stale render, an equipped
  unit missing from the rows, and a `mechanism` row whose retired sentence,
  pinned by hash, is present again in the file it was retired from. It runs
  the local-terms check over every row id, note, unit id, incident summary
  and behavior sentence: a match refuses, an absent list reports
  `unavailable` and never passes, and a present but empty or malformed list
  refuses. Nothing about the list is committed or hashed. The check is a
  document suite, as the harness, index and lineage checks are, with its
  `.gitattributes` row and its stub in `scripts/lib/document-gate-stubs.mjs`.
- **Batch one's candidates.** The rows name twelve new units for WO-097 and
  WO-098, chosen so that every taxonomy category that can lower to a
  mechanism has a member across the ten and the twelve; at least eight
  lower to rung 1 or 2; at least one lowers to a role skill at rung 7; at
  least one is cadence-shaped (a wait, retry or stall threshold expressed as
  a kernel `Cadence`); none duplicates an equipped unit; and each has a
  hand-written sentence in the always-on set to retire. Beside them at least
  one `reference` row is named, never a unit and never `mechanism`. The
  founding inventory (idea ledger §Notes 001) is the starting point; the
  executor selects on contact with the real shapes and records why each was
  chosen.
- **Declined alternatives, recorded:** importing or paraphrasing any
  predecessor file (clean room); a governance mode classified by hand (only
  a derived mode can be checked); the rows under `corpus/sanitized/` (the
  order names its lane and the corpus entry point links each lane; reopen
  when the corpus policy moves synthesized rows into that lane).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. `corpus/feedback/migration.json` (new; the directory with it). Schema:
   `{ schemaVersion: 1, capture: { sha256 | null, count | "unknown" }, categories: { <name>: { lowerable: bool, reason } }, alwaysOnSet: [...], excluded: { "employer-specific": N }, rows: [{ shapeId, category, rung, status, unitId?, enforcedBy?, batch?, reason?, note, restatementSearch, retired? }] }`.
   `alwaysOnSet` is computed: CLAUDE.md above the harness start marker, the `procedure:`
   arrays in `packages/skeleton/src/loadouts/contributor.ts` (lines 111, 133, 155, 179, 197,
   216 at the base; WO-196 renumbers them) and their support imports, and the product 07
   anchors `readDirectives` resolves. `restatementSearch` is a persisted judgment
   `{ set: [{ path, anchor, sha256 }], found: [{ path, text, sha256 }] }`; the check derives
   `mechanism` when the unit is equipped, its kind is not `prose` and `found` is empty, and
   refuses when any `set[].sha256` differs from the current file. `retired` is
   `{ path, text, sha256 }`: the check verifies `sha256(text)` and does a
   whitespace-normalized substring test, never sentence segmentation. No public capture names
   a SHA-256 for the feedback shapes, so `capture` records `null` and `"unknown"` with the
   ten-rule table (`docs/lineage/idea-ledger.md` §Chat 010, line 8634) as the public source;
   `lowerable` is the executor's recorded judgment per category with its reason (a shape is
   lowerable when a host fact can decide it).
2. `scripts/feedback.mjs` (new): exports `renderMigration(root)` and `checkMigration(root)`;
   CLI `migration [--check]`. Reads equipped units from
   `packages/skeleton/dist/src/loadouts/feedback.js` (`personalFeedbackUnits`), the lineage
   root through `docPath(root, "lineage", "feedback-migration.md")`, and runs
   `checkLocalTerms(root, surfaces)` over one surface per row field (`unavailable` prints and
   exits non-zero; a throw refuses). No literal `docs/` path.
3. `scripts/test-feedback.mjs` (new, `node:test`): cases: a stale render refuses; an equipped
   unit missing from the rows refuses; a mechanism row whose retired text is present refuses;
   a synthetic local term refuses (a temporary launchpad with its own
   `docs/control/local/terms.txt`); an absent list reports `unavailable`; an empty or
   malformed list refuses; a found restatement derives `prose`.
   Check: `npm run build && node --test scripts/test-feedback.mjs`.
4. `package.json`: add `"feedback": "node scripts/feedback.mjs"`. Check:
   `npm run feedback -- migration`.
5. `scripts/test-runner.mjs`: add
   `node("feedback-migration", "scripts/feedback.mjs", { args: ["migration", "--check"], document: true, needsBuild: true, preflight: true })`
   and `nodeTests("feedback-migration-fixtures", "scripts/test-feedback.mjs", { document: true })`;
   `scripts/lib/document-gate-stubs.mjs`: add `feedback.mjs` and `test-feedback.mjs` to
   `DOCUMENT_GATE_STUBS`. Check: `npm test -- --only feedback-migration`; `npm run test:docs`.
6. `.gitattributes`: add `/docs/lineage/feedback-migration.md dotln-generated dotln-check=suite:feedback-migration`
   (the value must match `^suite:[a-z][a-z0-9-]*$`, `harness-host.ts` line 2154).
7. Classification: fill the rows and exclusion counts; mark the ten compiled units
   `compiled`; the four prose-kind units derive `prose`; name six `batch-1a` and six
   `batch-1b` candidates and at least one `reference`. Check:
   `npm run feedback -- migration --check`;
   `npm run terms -- check corpus/feedback/migration.json docs/lineage/feedback-migration.md`.
8. Render: `npm run feedback -- migration`, then `npm run format`.
9. Write-backs: product 06, the pending rung heading that names WO-039 and WO-040 (one
   sentence that the ledger is generated at `docs/lineage/feedback-migration.md` with counts
   by status and governance mode; find the heading by those names at the base, because WO-190
   may have renamed it); product 02 §"### Feedback compiler v1": correct "the other three
   DotLn refusals" to the five, in place; `corpus/README.md`: one bullet for `feedback/`;
   `docs/evidence/WO-096/decisions.md`; `node scripts/meta.mjs`;
   `node scripts/check-publication.mjs --print-locks`; re-mint authority, artifact-identity
   and verification (`--write`) for `package.json`; `npm run publication:check`.
10. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
    complete `docs/evidence/WO-096/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the rows, renderer, check, render, the root script, the
write-backs below.

**Acceptance criteria (all required)**

1. The rows hold one row per shape of the capture, in
   the Design's row shape: the ten equipped units `compiled`, the four
   prose-kind units `prose`, and the other six derived by the rule with the
   executor's recorded search of the always-on set for each; employer
   shapes only as counts per exclusion class; the capture's SHA-256 pinned
   and the executor's count disclosed; rows plus exclusion counts equal to
   that count; and the render gives the counts per status and governance
   mode. The verifier judges the digest, the disclosure, the sum and each
   derivation; it does not re-read the intake. The criterion is judged
   against the declared set; a case outside it is a follow-up, not a
   failure.
2. `--check` refuses a stale render, an equipped unit missing from the
   rows, a fixture `mechanism` row whose pinned retired sentence is
   present, and a fixture row carrying a synthetic local term; without the
   list it reports `unavailable`, never a pass, and a malformed list
   refuses. The criterion is judged against the declared set; a case
   outside it is a follow-up, not a failure.
3. The rows name batch one's twelve candidates under the Design's selection
   rule, six for WO-097 and six for WO-098, and at least one `reference`
   row.
4. Write-backs land, each in place with no dated paragraph: 06
   §Application version pending — Harness lowering and rule migration (the
   migration rung's status, in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth); WO-190 renamed
   the heading on 2026-10-09, dropping its `→ WO-039 + WO-040` suffix; the
   rung's body names WO-040 as cut into WO-096 to WO-098 since 2026-10-10;
   WO-083, WO-095, WO-098 and WO-183 also write 06); `corpus/README.md` (the lane); the
   decisions file; the publication locks refreshed.
5. The re-mints the Cost line names are recorded; `npm test -- --review`
   and `npm run test:docs` green; `git diff --check` clean; no new
   dependency.

**Evidence gate:** the transcripts; the rows and the render;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `package.json` is a recorded source of the authority-, artifact-,
verification- and feedback-evidence suites, and again at final review. No
live row.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- 2026-10-10 entropy pass (WO-190 D006): the roadmap heading citation drops
  the carrier suffix WO-190 removed; the rung body now names this order as
  WO-040's ledger successor.
- Stale on 2026-10-07 and corrected above: product 06's bytes and
  co-writers (WO-086, WO-087, WO-061, WO-066, WO-124 closed; WO-112
  closed); product 02 names four refusals, not five, and this order
  corrects it; `idea-ledger.md` §Notes 001 is not the feedback inventory,
  §Chat 010 (line 8634) holds the ten-rule table.
- Decided by the 2026-10-07 pass: the capture denominator is recorded
  `unknown` with the public ten-rule table as source; `lowerable` is the
  executor's persisted judgment with a reason; the restatement search and
  the retired sentence are typed inputs (prose-parsing screen). Reopen: a
  public capture with a SHA-256 appears in the ledger.
- Blocked on WO-190 for the exact 06 heading (step 9 finds it by name).

**Non-goals:** compiling any unit (WO-097, WO-098); changing the compiler's
feedback contract; a restatement outside the declared always-on set (a
follow-up).

**Operator-review assumptions**

1. The operator may add or strike candidate shapes by `ideation:` before
   activation.
2. The executor's count of the capture is the denominator; no committed
   file can supply it, and a verifier judges its disclosure, not the
   intake.
3. A unit whose hook fires in some harness profiles and is role text in
   another counts as `mechanism`, with the render naming the profiles that
   carry it as role text.
4. The rows name twelve candidates as the selection rule states; WO-097's
   Design extends the compiler's ten-unit contract to hold them.
