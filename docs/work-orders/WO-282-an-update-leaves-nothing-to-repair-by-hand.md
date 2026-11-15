# WO-282 — An instance takes a release without repairing by hand what the update left (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** machinery
**Review ladder:** paired
**Release classification:** minor. The harness emit admits an instance's
own host surfaces whose bytes `main`'s harness manifest records; the update
preview says which side a conflicted merge keeps for the generated
manifest; a sync carries a re-keyed register row's dispositions; the update
plan's runtime guard, the update publish's history refusal and the
register's stale refusal are repaired; the guide's update section says
what it left out. No refusal is added or tightened. Assigned at activation
under the standing opt-out default.
**Cost:** adds about 20 lines in the emit's ownership reading, about 15 in
the update plan's runtime guard, about 10 in the update publish's history
refusal, about 40 in the register's projection, one line of preview output
and one refusal text, seven to nine fixture cases, and four sentences in the
guide (estimates, not bounds). Each update of an instance with a host the
starter lacks makes one more `git show` of `main`'s harness manifest
(unmeasured; one Git process). It removes the hand repairs an instance
reported on 2026-11-14: a manifest restored from `main` before the emit at
each update, and four register rows carried by hand after one. One complete
review run at final review. No judged feedback source is edited, so no live
feedback episode is owed; `scripts/lib/harness.mjs` is a registered source
of the authority and harness evidence editions, whose deterministic re-mint
`npm run sync` makes. Tokens and steps are unknown until run.
**Nomination provenance:** the operator's planning dispatch of 2026-11-14
(journal digest
`90a23f1bbae9b79f3c760f130d682a0bf463281b37ab7c81d46eace1b1507603`), which
asked for the instance's entries and the follow-ups left over; the
instance's entries 1 and 2 of that day (kept whole in the ignored local
planning lane, SHA-256
`47405c827aa3287adba12e61afbce893ba5834860747ba49aa87b2e5f9cc2655`),
evidence the operator carried, paraphrased here. Register rows
FUP-78b4c1ed19b20051 (WO-276-D160, item 1), FUP-c2004496635379d9
(WO-276-D162, items 1 and 3), FUP-d3cc376ffee92ed7 (WO-276-D200, first
half) and FUP-348ac9430f5e66f3 (WO-276-D155, item 2) are allocated here,
with WO-276-D059's reopening condition (another row re-keyed by WO-276's
reader with its disposition left behind), which the instance's entry 2
meets, and WO-258-D004's (an update merge that conflicts in a generated
surface the re-emit cannot repair), which its entry 1 meets. Clean-room
screen: the entries are in generic words and name kit files only.
**Depends on:** WO-277 and WO-281 by placement (each edits `docs/KIT.md`);
no hard edge.
**Recommended placement:** third, after WO-277 and WO-281.
**Cites (read these sections):** `docs/KIT.md` §Taking upstream updates;
`scripts/lib/harness.mjs` (`emitHarness`, `walkOwned`); `scripts/launchpad.mjs`
(`planUpdate`, `renderUpdatePlan`, `changedOnBothSides`);
`scripts/lib/release-list-cache.mjs` (`plainHistory`);
`scripts/lib/planning-followups.mjs` (`collectFollowupSources`, `projected`,
`dispose`); WO-276-D059, D065, D155, D160, D162 and D200; WO-258-D004.
**Objective:** Taking a release leaves nothing to repair by hand: the emit
keeps an instance's own host surfaces whose bytes `main`'s manifest
records, whichever side the merge kept; the preview says which side a
conflicted merge keeps for the generated manifest and why; a sync carries
the dispositions of a register row whose key a reader change moved; the
runtime guard covers every runtime path the incoming and pending manifests
list; a clone with a grafts file is refused for its true cause; and the
register's stale refusal names the revision to read.

**Observed gap (dated 2026-11-14 at `main` `ed66a822c`, v1.0.0):**

1. The emit refuses an instance's own Codex surfaces after a merge that
   took the starter's manifest. `emitHarness` reads ownership from the
   manifest on disk (`scripts/lib/harness.mjs` 497 to 510) and refuses a
   write under `.codex/` to a present file that manifest does not list. The
   starter's manifest is a Claude-only bundle's, the merge base holds no
   `.codex/` file for Git to remove, and the instance's entry 1 met
   `unowned Codex output refuses replacement: .codex/config.toml`; its
   route was `git checkout main -- .claude/harness-manifest.json` before the
   emit. Each manifest entry records an `fnv1a64` hash of the whole file
   (core's three `.codex/` entries read so), so a file whose bytes equal the
   hash `main`'s manifest records is one the instance's own emit wrote.
2. The guide's update section misleads at that conflict. It says a
   re-emitted file "is replaced, and the emit the update ends with writes
   it again" (`docs/KIT.md` 2057 to 2069), which reads in a Git merge as
   "take the starter's side"; the preview prints a bare `re-emitted: <path>`
   row (`scripts/launchpad.mjs` 3446). Its sentence that an instance with
   Codex or Copilot on "sees that host's surfaces as `remove` rows in the
   preview and in the merge" (2138 to 2143) held for the one update in which
   the starter stopped shipping Codex and is false for every later one: the
   rows come from the prior and incoming kit manifests (1833 to 1836),
   neither of which lists a `.codex/` path, and Git removes nothing the
   merge base lacks.
3. A reader change re-keys register rows and leaves their dispositions on
   rows that read missing. A candidate item's key hashes its bold title
   (`scripts/lib/planning-followups.mjs` 285 to 290); v1.0.0's Markdown
   reader reads a title holding `**` inside a code span or a glob longer than
   the line reader did. The item's text and its `source.hash` do not depend
   on the title (282 to 284, 221), and `projected()` (544 to 592) marks the
   old row missing with `hash: null` and creates the new one with no
   disposition. Core carried two such rows by hand (WO-276-D059); the
   instance's entry 2 carried four.
4. Three update-path defects WO-276's final review left
   (WO-276-D160, D162, D200): the runtime guard reads only the prior
   manifest's paths and counts an absent file as differing
   (`scripts/launchpad.mjs` 1815 to 1818); the update publish chooses
   between a shallow clone and no shared history by
   `--is-shallow-repository` alone (2610 to 2616), so a clone with a grafts
   file is refused for the wrong cause; and the register's stale refusal
   names no revision to read (`scripts/lib/planning-followups.mjs` 651).
   The guide's update section says nothing of the release-note contract an
   instance's own order no longer switches on (`scripts/release.mjs` 1561
   to 1562) or of the private list's comment and marker forms, which only
   §First steps describes.

**Design (scope discipline):**

- The emit admits, beside the manifest on disk, a `.codex/` path that
  `main:.claude/harness-manifest.json` lists with a `hash` equal to the
  file's bytes, read with the module's `runGit` and its `onFailure`, so a
  root that is not a repository or has no `main` keeps today's behavior.
  Rejected: admitting by path alone (axis: safety; an operator's own
  `.codex/config.toml` written while Codex was off on a branch would be
  overwritten once `main`'s manifest still lists it) and detecting an
  update branch by its name (axis: coupling; the hash test needs no branch).
- The preview prints one line above the kit rows when it plans the harness
  manifest as re-emitted, saying a conflicted merge keeps this instance's
  side of that file because the emit rewrites it, and the bare row stays as
  it is.
- The register carries a re-keyed row in `projected()`: a candidate row
  turned missing in this projection and a row created in it with the same
  `ref` and a hash equal to the old row's last present hash are one item.
  Where the old row's latest disposition was current, the old row ends on a
  `duplicate` naming the new one and the new row receives the old row's
  dispositions with `sourceRevision: 1` and their own `at`, so two
  worktrees' projections agree. Any other pair is left as today. Rejected:
  keying a row by its body alone (axis: identity; it would re-key every row
  whose body a later edit touches, which this carry leaves alone).

**Execution plan (the executor follows these steps in order; observed at
`ed66a822c`, 2026-11-14; after WO-277 and WO-281 have merged, the guide's
base is the later merge's):**

1. `scripts/lib/harness.mjs` `emitHarness`: read
   `main:.claude/harness-manifest.json` once through `runGit` with
   `onFailure`, and admit a write under `.codex/` to a present file that the
   on-disk manifest does not list when `main`'s manifest lists that path
   with a `hash` equal to the file's current bytes; every other case
   refuses as today. Case beside "WO-054 Codex installation preserves
   unowned configuration before any bundle write"
   (`scripts/test-harness.mjs`): a repository whose `main` manifest lists
   the three `.codex/` files, a branch whose on-disk manifest is a
   Claude-only bundle's, and the emit writing them; with one file's bytes
   changed, the refusal as today. Check: `npm test -- --only
   harness-fixtures` and `npm test -- --only harness`.
2. `scripts/launchpad.mjs` `renderUpdatePlan`: when the plan holds a
   `re-emitted` row for the harness manifest, one line above the kit rows
   saying a conflicted merge keeps this instance's side of that file and
   why. Assertion in the "WO-276 criterion I6" subtest
   (`scripts/test-launchpad-update.mjs`), whose bare-row assertion stays.
   Check: `npm test -- --only launchpad`.
3. `scripts/launchpad.mjs` `planUpdate` (the runtime guard, WO-276-D200
   first half): the guard covers every compiled runtime path the incoming
   and the pending manifests list that is present on disk, and counts a
   prior path the pending manifest dropped and that is absent as written by
   a kit. Two cases beside "WO-276 F8" (`scripts/test-launchpad-update.mjs`).
   Check: `npm test -- --only launchpad`.
4. `scripts/launchpad.mjs` `changedOnBothSides` (WO-276-D160 item 1): read
   the histories with a grafts file set aside, or name it in the refusal, as
   `plainHistory` in `scripts/lib/release-list-cache.mjs` does; one case
   beside the shallow-clone case (`scripts/test-launchpad-update.mjs`).
   Check: `npm test -- --only launchpad` and `npm test -- --only
   instance-history`.
5. `scripts/lib/planning-followups.mjs` `projected`: the carry of the
   Design, after the loop that marks rows missing. Cases: a candidate whose
   title reads differently under a changed title with the same body and
   section (the old row duplicate, the new row holding the old dispositions
   with their times and `sourceRevision: 1`); the same pair whose old row
   was already needing review (left as today); a body that also changed
   (left as today); and two projections of one change agreeing byte for
   byte. Check: `npm test -- --only process-debt` and `npm test -- --only
   meta`.
6. `scripts/lib/planning-followups.mjs` `dispose` (WO-276-D162 item 3): the
   stale refusal names the register revision to read, and the R3 case
   (`scripts/test-process-debt.mjs`) asserts it. Check:
   `npm test -- --only process-debt`.
7. `npm run sync`: the harness's emit, the evidence editions step 1 stales
   (authority and harness), the indexes. Check: the structural phase's
   freshness rows.
8. Write-backs. `docs/KIT.md` §Taking upstream updates: the paragraph on
   generated surfaces says a conflicted merge keeps this instance's side of
   the harness manifest and the emit rewrites it; the Codex sentence says
   what the preview and the merge show once the starter is Claude-only and
   that the re-emit writes an elected host's surfaces back; one sentence on
   the release-note contract an instance's own order no longer switches on
   (WO-276-D162 item 1); one on the private list's comment and marker forms
   with a link to §First steps step 4 (WO-276-D155 item 2).
   `docs/evidence/WO-282/decisions.md` records each step's decision with its
   reopening condition, and the decisions index is regenerated. Then the
   handoff sequence of product 07 §Discipline.

**Deliverables:** the emit's ownership reading and its cases; the preview
line; the runtime guard, the grafts refusal and their cases; the register's
carry and refusal and their cases; the write-backs, the decisions and the
regenerated pages and editions.

**Acceptance criteria (all required)**

1. The case beside "WO-054 Codex installation preserves unowned
   configuration before any bundle write" passes under `npm test -- --only
   harness-fixtures`: on a branch whose on-disk manifest is a Claude-only
   bundle's, `node scripts/harness.mjs emit` writes the `.codex/` files
   whose bytes `main`'s manifest records and `node scripts/harness.mjs check`
   then passes; with one of those files' bytes changed, the emit refuses
   with `unowned Codex output refuses replacement` naming it and writes
   nothing, as the existing case shows for a file no manifest lists.
2. Under `npm test -- --only launchpad`, a preview whose plan holds
   `re-emitted: .claude/harness-manifest.json` prints the line naming that
   file and the side a conflicted merge keeps above the kit rows, and the
   row itself still reads `re-emitted: .claude/harness-manifest.json`; the
   two runtime-guard cases and the grafts case pass.
3. Under `npm test -- --only process-debt`, a sync over a candidate re-keyed
   with its body and section unchanged leaves the old row `duplicate`
   naming the new one and the new row holding the old dispositions, and
   `npm run plan -- followups` counts neither as needs-review or
   untriaged; a pair whose old row already needed review, and a pair whose
   body changed, are left as before; the stale refusal names the register
   revision.
4. The kit guide §Taking upstream updates states which side of
   `.claude/harness-manifest.json` a conflicted merge keeps and why, what
   the preview and the merge show for an elected host's surfaces once the
   starter is Claude-only, the release-note contract an instance's own
   order no longer switches on, and the private list's comment and marker
   forms with a link to §First steps; no standing document says that an
   instance with Codex on sees `remove` rows in the merge. Check:
   `npm run test:docs` and `grep -n "remove. rows" docs/KIT.md`.
5. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only harness-fixtures`, `npm test -- --only
harness`, `npm test -- --only harness-evidence`, `npm test -- --only
authority-evidence`, `npm test -- --only harness-context`, `npm test --
--only launchpad`, `npm test -- --only launchpad-planning`, `npm test --
--only instance-history`, `npm test -- --only process-debt`, `npm test --
--only meta`, `npm test -- --only configuration-root`, `npm test -- --only
sync-fixtures`, `npm test -- --only registrations` and `npm test -- --only
runner-fixtures` for the steps that name them; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-282/`: the emit's two arms with
their exit codes; the preview's output with the line; the register's
projection before and after the carry for the re-keyed pair; `npm run
resume -- status --json` after `implementation-ready`.

**Write-back duty:** as step 8 lists; the release's Read before upgrading
says that a register row re-keyed by an earlier release is carried by the
next sync only where both rows are created and retired in that sync, and
that the emit now keeps an instance's own host surfaces through a merge that
took the starter's manifest.

**Known issues and carry-ins:**

- WO-281 rewrites the kit guide before this order runs. The passages of
  §Taking upstream updates this order corrects keep their facts and their
  heading and lose their wording, so the executor finds each by its fact,
  and writes each correction in the rewritten section's shape.
- Until WO-278's paired launch exists, this order's first round is
  launched by hand as WO-276-D118 records: each of the three kinds and the
  combined worker with no `--recheck`, all naming the same `--since` base,
  each dry run's reviewed tree read before its launch.
- A register row an instance carried by hand before this release, or one a
  sync already left needing review, is not carried again: the carry judges
  a pair created and retired in one projection.
- Receipts filed under an earlier reader's reading (WO-276-D164 F54) are a
  different store and stay with their register row.

**Non-goals:** the commands page (WO-277); the emit's reading of anything
but `.codex/` ownership; a new refusal of any kind.

**Operator-review assumptions:** none beyond the order's text.
