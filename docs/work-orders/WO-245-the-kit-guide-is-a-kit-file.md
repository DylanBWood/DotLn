# WO-245 — The kit's guide is a kit file and the front page is the instance's: the launchpad guide moves from the seeded README into `docs/KIT.md`, a manifest-listed kit file every update carries; the root `README.md` is seeded once as a short instance page that the starter refresh rewrites only while it still equals a prior exported rendering and never refuses on; the seed template is frozen by a pinned digest; and a launchpad's release prepare and close admit a front page without the release block (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** minor. One new kit file, one changed seed, one
refresh rule, one release-prepare admission in a kit root; no new operator
command. Assigned at activation under the standing opt-out default.
**Cost:** adds `docs/KIT.md` (new, kit-owned): the text of
`scripts/kit/README.client.md` with its opening rewritten for a reader who
arrives from the instance's own front page and its `This source prepares`
block removed, about 60 KB, listed in the kit's document list beside
`docs/PLAYBOOK.md` (`scripts/launchpad.mjs` 247); `scripts/kit/README.client.md`
rewritten as the short seed (the release display name, one paragraph saying
what the repository is and where the kit's guide is, the release block, one
sentence inviting the owner to replace everything but the block; about 1 KB)
with its SHA-256 pinned in `scripts/test-launchpad-export.mjs` (the
`launchpad-docs` suite); in `scripts/lib/starter-seeds.mjs` (`planStarterSeeds`, from
109; the refusal at 206 to 209) the README rule: `README.md` is rewritten only while the starter's
copy equals a prior exported rendering, a customized, missing or non-regular
copy is reported `kept` with its reason and never refuses the refresh (the
refusal "starter seed differs from prior export" lists the other seeds only),
and `scripts/lib/starter-refresh.mjs` (593 to 608, 884) carries `keptSeeds` on
the result row; in `scripts/lib/release-preparation.mjs` (137 to 220) and
`scripts/release.mjs` (880 to 925) a kit root (`isKitRoot`, 869) whose
`README.md` carries no release markers is admitted: `release prepare` writes
no claim and records `not carried` in the decision it writes, and the close's
release-block check passes as `not carried`, while markers present keep every
rule and core keeps its requirement; the `docs/README.md` seed
(`scripts/launchpad.mjs` 1088 to 1108) names `docs/KIT.md`; cases in
`scripts/test-launchpad-export.mjs` (the manifest lists `docs/KIT.md`; the
seed's digest; the seed carries the block), `scripts/test-launchpad-update.mjs`
(2316 to 2345: the refresh rewrites a starter README equal to the long guide
once, keeps a hand-edited one and reports it, keeps a missing one, refuses
nothing on its account and publishes its kit files), `scripts/test-release-preparation.mjs`
and `scripts/test-release.sh` (a kit root without the block; one marker still
refuses), `scripts/test-instance-history.mjs` (an updated instance keeps its
replaced README and prepares a release); product 03 §Platform and instance
boundary; `docs/KIT.md` §Kit files and instance files and §Taking upstream
updates. Removes: the state where every instance's front page is the kit's
60,857-byte guide, where a starter refresh rewrites it at each release whose
template changed and a fork's merge carries it (v0.103.0 and v0.103.1 both
did), where an instance that edits it forks the file from every later update
or meets a merge conflict, and where a launchpad's release prepare refuses a
front page without the block. Wall-clock: the export writes one more kit
file (milliseconds); the refresh's README judgment is the proven-seed walk it
makes today; no gate step gains work. Context bytes: this file, about 18,000;
an instance's front page falls from 60,857 bytes to about 1,000, and the guide
is read on demand. Commands: none new. Tokens: unknown until run. Steps: 9.
Re-mints: none of `scripts/launchpad.mjs`, `scripts/lib/starter-seeds.mjs`,
`scripts/lib/starter-refresh.mjs`, `scripts/release.mjs` and
`scripts/lib/release-preparation.mjs` is a registered evidence source
(`scripts/lib/evidence-sources.mjs`), so no edition is staled and no live
feedback episode is owed; `scripts/launchpad.mjs`, `scripts/release.mjs` and
`scripts/lib/release-preparation.mjs` are declared machinery sources
(`scripts/test-runner.mjs` 159, 160, 186), so `npm test -- --review` runs
before handoff.
**Nomination provenance:** the operator's item 1 of the 2026-10-31 planning
dispatch (ignored capture
`docs/intake/notes/planning-kit-guide-home-fork-block-and-drive-returns-2026-10-31.md`,
SHA-256 `be49aeb50d95aac99a5dace4ca1aa8b4aa8a719f9e1a947fe5884be00e838180`):
the information the kit gives in the README is good, an instance should be
able to overwrite its main README immediately with no issue and no chance of
it being overridden when merging the latest kit, find a better spot for it;
the DotLn-Enterprise-Starter fork's items 1 and 7 of its second pass of
2026-10-30 (`README.md` carried by the v0.103.1 merge with no instance action;
its WO-025 excludes the file for that reason; its row FUP-c9f1e0a81d3ddaba);
core's row FUP-b44117f7b047e976 (four template-derived carriers in two
releases). Filed by the
[2026-10-31 pass](../planning/kit-guide-home-fork-block-and-drive-returns-2026-10-31.md).
Planner-synthesized. Opaque identifier, not a priority. Clean-room screen: no
stop condition; the operator's private instance is named only as such.
**Depends on:** WO-215 (closed, v0.81.0: core's release close refreshes the
starter through the seed plan this order changes); WO-077 (closed, v0.74.0:
seeds as instance files the kit update never touches); WO-203 (closed,
v0.79.0: the update preview whose report names seeds); WO-086 (closed: the
README release block as the one claim `release prepare` writes).

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-215",
    "relation": "satisfied-by-close",
    "reason": "the starter refresh and its seed plan this order changes"
  },
  {
    "workOrderId": "WO-077",
    "relation": "satisfied-by-close",
    "reason": "seeds as instance files the update never touches, which README.md stays"
  },
  {
    "workOrderId": "WO-203",
    "relation": "satisfied-by-close",
    "reason": "the update preview and its report of seeds and instance actions"
  },
  {
    "workOrderId": "WO-086",
    "relation": "satisfied-by-close",
    "reason": "the README release block as the one claim release prepare writes, made optional in a kit root"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/launchpad.mjs` (`KIT_TEMPLATE_FILES`
263 to 274; the kit document list at 247; `addSeed("README.md", …)` 1063; the
`docs/README.md` seed 1088 to 1108; "instance seeds are written once" at 6);
`scripts/lib/starter-seeds.mjs` (the eight seeds 20 to 36; `namedStarterSeed`
46 to 52, the claim line's display name; `planStarterSeeds` from 109: the
proven-seed rule with its README special case at 183 to 188 and the refusal
"starter seed differs from prior export" at 206 to 209);
`scripts/lib/starter-refresh.mjs` (the seed plan 593 to 608; the seed writes
725 to 754; `rewrittenSeeds` 884); `scripts/lib/release-preparation.mjs`
(`releaseClaimLine` 25; the README read 137; the block requirement 170 to
220); `scripts/release.mjs` (`isKitRoot` 869; the release-block check and
its kit-root remedy 880 to 925); `scripts/docs-check.mjs` (`frontPageFindings`
1464 to 1500: no record, no finding); `scripts/kit/README.client.md` (60,857
bytes; its eleven sections at 81, 285, 378, 425, 557, 571, 635, 792, 826,
918 and 942; the claim at 395); `scripts/test-launchpad-update.mjs` 2316 to
2345 (the refresh case appends to the template); product 03 §Platform and
instance boundary (215 to 227: seeds "written once and never
manifest-listed"; 262 to 272: editing a kit file is the true-fork path);
the fork's pass document of 2026-10-30 §Requests to core items 1 and 7;
WO-238 (its step 9 and Cost paragraph on `README.client.md`, which this
order supersedes for the README).

**Objective:** An instance owner opens their repository and sees their own
front page. They may replace `README.md` the day they clone, and no later kit
update, starter refresh or Git merge touches it again. The kit's guide, every
section the README held, lives at `docs/KIT.md`, listed in the manifest and
carried by every update as the playbook is. The front page the kit seeds is
one short page that points at the guide and carries the release block; the
block is the only thing a launchpad's own releases read from the page, and
even that may go.

**Observed gap (dated 2026-10-31 at `main` `c27abd53`):**

- `addSeed("README.md", template("README.client.md"))` (`scripts/launchpad.mjs`
  1063) seeds the 60,857-byte guide as every instance's front page;
  `scripts/kit/README.client.md` is also a manifest-listed kit file under
  `scripts/kit/`, so every instance carries the guide twice, once as its
  page and once as a template.
- `planStarterSeeds` lists `README.md` among eight refresh seeds. At each
  release whose template changed, a starter copy that still equals a prior
  rendering is rewritten (`rewrittenSeeds`), and a customized copy refuses
  the whole refresh ("starter seed differs from prior export … no seed
  replaced or pushed"). The starter's `README.md` changed in v0.103.0 and
  v0.103.1; the fork's merges of both carried it, with no conflict only
  because the fork never edited it (its items 1 and 7 of 2026-10-30); its
  WO-025 quality pass excludes `README.md` on that account.
- WO-238 plans to cut `README.client.md` to the instance's needs and move
  the kit's explanation into the kit's own `docs/`; it leaves the seed rule,
  so a cut page would still be rewritten by the next template change and
  still conflict with an instance's edit. This order takes the move and the
  rule; WO-238's step 9 then edits `docs/KIT.md`.
- `release prepare` requires "one exact ordered README release block"
  (`release-preparation.mjs` 174 to 177) and the close's check fails
  `release-block` without it (`release.mjs` 905 to 921), with a kit-root
  remedy that sends the instance to the update route and then to adding
  the three lines by hand; the fork's `README.md` carries `This source
  prepares Launchpad v0.3.3` at line 395. An instance that replaces its
  page and drops the block cannot prepare a release until it restores them.
- The document check's front-page guard reads `docs/control/front-page.json`
  (`docs-check.mjs` 1464 to 1500) and the kit carries no such record
  (`KIT-MANIFEST.json` lists `docs/PLAYBOOK.md`, two product documents, one
  publication template and one releases template under `docs/`), so an
  instance's page is already unguarded by the check; only the seed rule and
  the release block stand in the way.
- The kit's `docs/README.md` seed names `UPSTREAM.md` for the kit's
  provenance and names no guide.

**Design (scope discipline):**

- **The guide is a kit file, named for what it is.** `docs/KIT.md`, beside
  `docs/PLAYBOOK.md` in the kit's document list, listed in the manifest,
  replaced by every update, edited by an instance only on the true-fork path
  the guide itself states. Rejected: `docs/kit/README.md` (axis: every
  directory README under `docs/` is an instance seed stating the root's
  convention; a kit-owned README among them breaks that rule). Rejected:
  leaving the guide in the README with WO-238's cut (axis: a smaller seed is
  still a refreshed seed; the merge carries each change and an edit still
  forks or conflicts).
- **The front page is seeded once and never fought over.** The seed is
  short: what this repository is, where the guide is, the release block, and
  one sentence inviting the owner to replace everything but the block. The
  refresh rewrites a starter's `README.md` only while it still equals a
  rendering of a prior template (the proven-seed rule it applies today),
  reports a customized copy as kept and refuses nothing on its account. The
  seed template's digest is pinned in the `launchpad-docs` suite, so a
  change to it is a deliberate act whose order names the one rewrite that
  unedited starter copies will see. Rejected: dropping `README.md` from the
  refresh seeds outright (axis: the starter's own page would keep the 60 KB
  guide for good, stale and pointing nowhere; the proven rule gives this
  release its one migration and then has nothing left to rewrite while the
  pin holds). Rejected: a kit instance action that rewrites `README.md`
  (axis: actions are opt-in and manual after the merge; the merge carries
  the one-time rewrite by itself, as it carried the last two).
- **The release block becomes the instance's option.** In a kit root,
  `README.md` without release markers is admitted: `release prepare` writes
  no claim and records `not carried` in the decision it writes, the close's
  release-block check passes as `not carried`, and markers present keep
  every existing rule, so an instance that keeps the seed keeps its claim.
  Core's front page keeps its requirement. Rejected: moving the claim to
  another file (axis: core's page rule and the release machinery read one
  place; an optional block in a kit root is one condition, a second claim
  location is a second reader on every release step). Rejected: appending
  the block to an instance's page when absent (axis: a release step writing
  into the owner's page is the override the operator ruled out).
- **Live-run surfaces at the base.** The export's kit document list, the seed
  writer, the refresh's seed plan, the release-block checks and the
  `launchpad-docs` digest cases: exist. `docs/KIT.md`, the short seed, the
  kept-not-refused rule and the kit-root admission: absent.

**Execution plan (the executor follows these steps in order; observed at `c27abd53`, 2026-10-31):**

1. `docs/KIT.md` (new): the text of `scripts/kit/README.client.md` with its
   opening paragraph rewritten for a reader arriving from the instance's
   page (the first sentence names the file as the kit's guide for the
   launchpad it ships with), its `This source prepares` block removed, and
   its §Kit files and instance files naming `docs/KIT.md` among the kit files
   and `README.md` among the instance files written once; `scripts/launchpad.mjs`
   247: the kit document list gains `["docs", "KIT.md"]`. Check: `npm test
   -- --only launchpad-docs`; `npm test -- --only launchpad`.
2. `scripts/kit/README.client.md`: the short seed (the release display name
   as its title, one paragraph, the pointer to `docs/KIT.md`, the release
   block with its `v0.1.0` claim, the invitation); `scripts/test-launchpad-export.mjs`:
   the seed's SHA-256 pinned, with a comment stating the rule (a change to
   the seed rewrites every unedited starter copy once and is named in the
   changing order's decisions and its release's Read before upgrading).
   Check: `npm test -- --only launchpad-docs`.
3. `scripts/lib/starter-seeds.mjs` `planStarterSeeds` (from 109; the
   refusal at 206 to 209): for
   `README.md` the proven-seed rewrite stays and the refusal goes: a
   customized, missing or non-regular copy is planned as `kept` with its
   reason and the refusal message lists the other seeds only;
   `scripts/lib/starter-refresh.mjs` (593 to 608, 884): the result row
   carries `keptSeeds` beside `rewrittenSeeds`. Fixture in
   `scripts/test-launchpad-update.mjs` (2316 to 2345): a starter `README.md`
   equal to the prior tag's long guide is rewritten once to the short seed
   and named in `rewrittenSeeds`; a hand-edited copy is kept, named in
   `keptSeeds`, and the refresh publishes its kit files; a missing copy is
   kept the same way; `CLAUDE.md` and `.gitignore` keep their refusals.
   Check: `npm test -- --only launchpad`.
4. `scripts/lib/release-preparation.mjs` (137 to 220): in a kit root with no
   release markers, the heading takes its version, no README write is made,
   and the decision records `readmeClaim: "not carried"`; `scripts/release.mjs`
   (880 to 925): the release-block check reports `PASS release-block: not
   carried (kit root without markers)`; markers present keep the existing
   refusals (one marker, two blocks, prose in the block); core is unchanged.
   Fixtures: `scripts/test-release-preparation.mjs` (a kit-root fixture
   without markers prepares; one marker refuses as today) and
   `scripts/test-release.sh` (a kit-root close without the block). Check:
   `npm test -- --only release-preparation`; `npm test -- --only release`.
5. `scripts/launchpad.mjs` 1088 to 1108: the `docs/README.md` seed names
   `docs/KIT.md` as the kit's guide beside `UPSTREAM.md`. Check: `npm test --
   --only launchpad-docs`.
6. `scripts/test-instance-history.mjs`: an instance whose `README.md` was
   replaced keeps its bytes through an update, passes its document gate and
   prepares a release. Check: `npm test -- --only instance-history`.
7. The starter: the release close that carries this order refreshes
   DotLn-Enterprise-Starter, whose `README.md` equals the v0.104.0 rendering
   (`This source prepares DotLn v0.1.0` at 395), so the proven rule rewrites
   it once and the close row's `rewrittenSeeds` names it. The executor
   rehearses that in step 3's fixture; the real refresh is release close's,
   recorded on its close record. Fallback when the close refuses the
   refresh: the close's own seed remedy, recorded in the decisions.
8. Write-backs: product 03 §Platform and instance boundary (the client
   README is `docs/KIT.md`, a kit file; `README.md` a seed written once and
   rewritten only while unedited; the refresh rule); `docs/KIT.md` §Kit files
   and instance files and §Taking upstream updates (what the refresh does
   with `README.md`; the release block as the instance's option; the one
   conflict an instance meets if it edited `README.md` before taking this
   release, resolved by keeping its own); `docs/evidence/WO-245/decisions.md`;
   `npm run meta`; `node scripts/lineage.mjs index --check`; `npm run
   publication:check`.
9. Handoff: integrate `main` first when it has moved (WO-233's rule);
   finish source edits; `npm run format` and `npm run sync`; the three
   fresh independent reviewers the executor root requires; one `npm test
   -- --review` in the background awaited with `node scripts/harness.mjs
   evidence --wait`; `docs/evidence/WO-245/handoff.md`; `npm run test:docs`
   once after the last document edit; `npm run resume --
   implementation-ready <flags>` (product 07 §Discipline).

**Deliverables:** `docs/KIT.md` in the kit; the short seed and its pin; the
kept-not-refused refresh rule with `keptSeeds`; the kit-root admission in
release prepare and close; the `docs/README.md` pointer; the cases; the
write-backs.

**Acceptance criteria (all required)**

1. `KIT-MANIFEST.json` of a fixture export lists `docs/KIT.md` with its
   SHA-256; the file carries every section the v0.104.0 `README.client.md`
   held (its eleven headings by name) and no release block; the
   `launchpad-docs` case pins the seed's digest.
2. A fixture export's `README.md` is the short seed: it names the display
   name and `docs/KIT.md`, carries the release block with the `v0.1.0` claim
   and nothing else in it; the export's `docs/README.md` names `docs/KIT.md`.
3. In the refresh fixture, a starter `README.md` equal to a prior rendering
   is rewritten once and named in `rewrittenSeeds`; a hand-edited one is
   kept, named in `keptSeeds` with its reason, and the refresh publishes its
   kit files; a missing one is kept the same way; `CLAUDE.md` and
   `.gitignore` keep their refusals.
4. In a kit-root fixture, `release prepare` without markers assigns the
   heading and writes no README claim, recording `not carried`; the close's
   release-block check passes as not carried; with markers present the
   existing refusals hold; core's fixture keeps its requirement.
5. An updated instance whose `README.md` was replaced keeps its bytes,
   passes `npm run test:docs` and prepares a release (the instance-history
   case).
6. Product 03 and `docs/KIT.md` state the rule as built; `npm run
   publication:check` is green.
7. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Preflight:** `npm test -- --only launchpad-docs` for steps 1, 2 and 5;
`npm test -- --only launchpad` for steps 1 and 3; `npm test -- --only
release-preparation` and `npm test -- --only release` for step 4; `npm test
-- --only instance-history` for step 6; `npm run test:docs` when a document
changes; each under `node scripts/harness.mjs bounded --`; then one `npm
test -- --review` (07-execution-guide.md §Preflight before the full gate).

**Evidence gate:** the cases of criteria 1 to 5; `npm test -- --review`
before `implementation-ready`, final review reusing the passing complete row
at the integrated code identity when one exists.

**Write-back duty:** as listed in step 8 and criterion 6.

**Known issues and carry-ins:**

- FUP-b44117f7b047e976's README half: the template-derived carriers were
  `README.md`, `docs/control/budgets.json`, `CLAUDE.md`'s generated block and
  `docs/PLAYBOOK.md`; this order settles `README.md`, and the other three
  stay WO-207's (the update preview naming a seeded file whose template
  changed) (reopen: a release carries another seed into a fork's merge with
  no instance action declared).
- An instance that edited `README.md` before taking the release that
  carries this order meets one merge conflict on it, the starter's one-time
  rewrite against its edit; the guide says to keep the instance's version
  (reopen: the fork reports a second conflict on `README.md` after this
  release).
- WO-238's step 9 (the README cut and the move into the kit's `docs/`) is
  superseded for the README by this order; WO-238 edits `docs/KIT.md` where
  its sections hold history instead of state (the filing pass amends
  WO-238).
- The seed's pin makes the seed's wording a deliberate change; a release
  that changes it names the rewrite in its decisions and its Read before
  upgrading (reopen: a starter refresh rewrites `README.md` with no decision
  naming it).
- `README.client.md` keeps its file name so `KIT_TEMPLATE_FILES`, the update
  case and the refresh's prior-template lookup keep working, although the
  file is now the seed; renaming it is left (reopen: a reader is misled by
  the name).

**Non-goals:** core's own `README.md` and its front-page rule; the instance
actions machinery; WO-207's update log, rollback and channel; any other
seed's refresh rule; the fork's own README text; a second claim location.

**Operator-review assumptions:** that `docs/KIT.md` is the right name and
home (the pass's choice; `docs/LAUNCHPAD.md` and `docs/kit/README.md` were
weighed); that the release block stays on the front page as an option
rather than moving; that one conflict for an instance that edited
`README.md` before this release is acceptable, with the resolution written
in the guide. Reopen any of these on the operator's word.
