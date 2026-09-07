# WO-041 final review FINAL-001

**Verdict: WO-041 fails final review.** The verified deliverable stands as
VER-002 left it; nothing in the mechanism, its fixtures, or its write-backs is
overturned here. The failure is that the reviewed package cannot be published
or released as it sits, for three reasons that are each outside a reviewer's
non-substantive correction authority:

1. **The release target is already published.** The order's heading, README
   release block, and roadmap completion claim `v0.13.2`. WO-038, the other
   half of the first paired wave, merged to `main` at 16:23:01Z on 2026-09-07
   and was tagged `v0.13.2` at 16:25:04Z, three minutes after VER-002's pass
   was recorded at 16:20:02Z. The release-surface preflight now reports
   `latest published v0.13.2` against a work-order target of `v0.13.2`;
   release close refuses an equal version whose tag names a different commit.
   Independently of the collision, the README block carries two strict
   versions (`v0.13.2` and `v0.13.1`) where the rule requires exactly one; that
   rule was in force at the executor's base.
2. **The skeleton's `src/` changed without a component version change.** Four
   existing skeleton modules are edited and four are added, while
   `@dotln/skeleton` stays at `0.12.0`, the version recorded at `v0.13.1` and
   `v0.13.2`. The component-version rule in `scripts/release.mjs` predates this
   order and fails on this tree. The roadmap completion and the executor
   evidence both state that component versions are unchanged; on this rule
   that is the defect, not a mitigation. A version bump is a compatibility
   surface and belongs to repair, not to final review.
3. **The subject was verified on a base that `main` has since left, and the
   integration is substantive.** A temporary-index merge probe against `main`
   conflicts in seven files, three of them authored (`README.md`,
   `docs/product/06-roadmap.md`, `package.json`). WO-038's manifest and
   lockfile changes move the feedback audit's declared source pin, so the
   WO-041 feedback evidence edition that VER-001 and VER-002 accepted fails its
   own `--check` on the integrated tree and needs a fresh bounded live verifier
   run, exactly as WO-038 itself needed. The playbook's paired-wave rule and
   the phase-two plan's sync procedure both say this returns through repair and
   a fresh numbered verification before final review; an old report cannot
   certify the combined subject.

The first two are executor defects against rules that existed when the work was
done; neither VER-001 nor VER-002 ran `check-surfaces`, which is the only
runner of those rules outside `worktree publish` and `release close`, so the
defects survived two verifications. The third is not anyone's defect: the base
moved after the last verdict, and the lifecycle's only legal action from
`verified` is final review, so this report is the designed route back to
repair. §Required repair gives the ordered checklist, with the authority each
step rests on, so that VER-003 and FINAL-002 have a bounded subject.

- Subject work order: `docs/work-orders/WO-041-plan-refutation-mechanism.md`,
  including its 2026-09-07 activation completion (heading target `v0.13.2`).
- Subject state: branch `wo-041`, worktree `DotLn-wo041`, uncommitted working
  tree, 2026-09-07. `HEAD` is `01c2e321268bf9cb9842b58b3e95fc8ed5a09d67`, the
  merge of the 2026-09-06 phase-two planning pass and the merge base with
  `main`. `main` and `origin/main` are both
  `a360d04ac865e6a55c64f06cd0467f9e69acf9f7`, the WO-038 merge (#43), which
  the annotated tag `v0.13.2` names. `git log main..wo-041` is empty, so the
  entire subject is the dirty tree, one merge behind `main`. At review open,
  after the dispatch transition and the index refresh: 43
  `git status --porcelain -uall` entries, 23 tracked modifications (23 files,
  401 insertions / 107 deletions against `HEAD`, including the control
  projection and the generated index) and 20 untracked files: the control
  segment (nine events through this dispatch), six files under
  `docs/evidence/WO-041/`, the live receipt pair under
  `docs/planning/refutations/`, `VER-001.md` (388 lines) and `VER-002.md`
  (282), four new skeleton modules (640 lines), and five new scripts (2,231
  lines including the 993-line fixture suite).
- Verification sequence read in full: `VER-001` (fail: two guards that did not
  guard) and `VER-002` (pass: both repaired and fixture-bound). Their
  adjudication is in §The verified deliverable stands.
- Ideation receipt: none; no ideation breakout was opened on this order.
- Checkpoints: implementation-ready `e8e5af6` (`refs/dotln/checkpoint/WO-041/2`),
  VER-001 verdict `faa095f` (4), repair-complete `9595d33` (6), VER-002
  verdict `bbd6a69` (8), this dispatch `7acb15e` (9), recorded at
  2026-09-07T16:38:32.154Z.

## Actor

This review ran on the Claude Code CLI, version `2.1.263` (`claude --version`
observed in this session; the version is on the harness's observed `versions`
list in `docs/discovery/environment.json`), model `claude-fable-5-1`, at
reasoning effort `max` selected by this session's model control. The value is
self-reported: `max` is on the harness's documented `sessionEffortSelector`
values, while `effectiveEffortReadback` for `claude-code` remains `not found`
with `harnessReadbackEligible: false`, so `harness-readback` is unavailable and
not claimed. The shell exposes `CLAUDE_EFFORT=max`, which is a launch
selection visible to the process, not a recorded readback. The work order
declares the reviewer role `any`.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-fable-5-1","effort":"max","source":"self-reported"}

### Actors across the order, against the declared minima

The order declares `Effort: executor xhigh+; verifier xhigh+; reviewer any`
and `Model: any capable model`. Every completed value is at or above its floor;
the projection reports `Effort drift: none`.

| Role and event                    | Actor (control log)                                                           | Floor    | Meets |
| --------------------------------- | ----------------------------------------------------------------------------- | -------- | ----- |
| executor, `ImplementationReady`   | codex-cli 0.153.4, `gpt-6-astra`, `max`, operator-attested                    | xhigh+   | yes   |
| executor, `RepairCompleted`       | codex-cli 0.153.4, `gpt-6-astra`, `max`, operator-attested                    | xhigh+   | yes   |
| verifier, `VER-001` (fail)        | claude-code 2.1.263, `claude-opus-5[1m]`, `max`, self-reported                | xhigh+   | yes   |
| verifier, `VER-002` (pass)        | claude-code 2.1.263, `claude-opus-5[1m]`, `max`, self-reported                | xhigh+   | yes   |
| reviewer, `FINAL-001` (this, fail) | claude-code 2.1.263, `claude-fable-5-1`, `max`, self-reported                | any      | yes   |

Both verification reports carry a machine header equal to their control
event. Quoted here indented so that only this report's own header starts at
column one:

> `**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.263","model":"claude-opus-5[1m]","effort":"max","source":"self-reported"}`
> (VER-001 and VER-002, identical; the same verifier repeated, which the
> reports disclose and which is not a self-verification since the implementer
> and the repairer are the Codex executor.)

Implementer, verifier, and reviewer are structurally separate: Codex CLI wrote
the deliverable and the repair, Claude Opus 5 verified twice, Claude Fable 5.1
reviews.

## Dispatch and subject integrity

`npm run resume --silent -- status --json` at open: phase `verified`, latest
verification `VER-002` with verdict `pass`, `legalNextActions: ["final-review"]`.
`npm run resume -- final-review` allocated
`docs/final-reviews/WO-041/FINAL-001.md` and checkpoint 9; the index was
regenerated after the dispatch and will be regenerated again after the verdict.

The tree reviewed is the tree VER-002 passed plus the lifecycle's own
bookkeeping. A temporary-index tree of the working tree (`2308756`, the same
tree the merge probe below used) differs from the VER-002 verdict checkpoint
`bbd6a69` (`refs/dotln/checkpoint/WO-041/8`) by `git diff-tree` only in
`docs/control/current.md`, `docs/control/orders/WO-041.jsonl`, and the
regenerated `docs/work-orders/README.md`, and every untracked file in the
working tree is present in that checkpoint. Against the VER-002 request
checkpoint `5e85c81` (7) the only addition is `VER-002.md` itself. No
substantive file moved between the VER-002 verdict and this review.

## What this review re-established first-hand

All inside the Claude Code sandbox, on this worktree, without any destructive
Git command:

- `npm test` on the reviewed tree: exit 0. Prettier clean; the shell suites (fixture temp root, publication, intake backup, resume, checkpoint, worktree, release, work orders); `check-publication.mjs` with both audience locks `CURRENT`; `index --check` current; `tsc -b --force`; 281 of 281 package tests, 8 of 8 identity-corpus tests, and 21 of 21 mutation self-tests; all eleven plan-refutation fixture groups; the artifact-identity, verification-evidence, and feedback-evidence checks, the last against the WO-041 edition on this tree; ending
  `Plan gate: {"receipts":1,"passes":0,"enforcement":"pending introduction commit","localTerms":"unavailable"}`.
  The gate is green on the un-integrated tree; §Blocking findings explains why
  that does not carry to the integrated one.
- `npm run plan --silent -- check`:
  `{"receipts":1,"passes":0,"enforcement":"pending introduction commit","localTerms":"unavailable"}`.
  The live receipt pair validates end to end against a subject rebuilt from
  its recorded revision `01c2e32`, which remains an ancestor of `main`, so the
  receipt stays resolvable after integration.
- `node scripts/check-publication.mjs`: 234/234 product headings indexed, both
  audience locks `CURRENT`.
- `git diff --check`: clean.
- `npm run release --silent -- check-surfaces` on the working tree, verbatim:

  ```text
  FAIL release-block: observed v0.13.2, v0.13.1; expected exactly one v0.13.2 (work-order target v0.13.2; latest published v0.13.2)
  PASS component-version @dotln/compiler: src unchanged; observed 0.6.0; previous v0.13.2 0.6.0; expected no bump required
  PASS component-version @dotln/kernel: src unchanged; observed 0.2.1; previous v0.13.2 0.2.1; expected no bump required
  FAIL component-version @dotln/skeleton: src changed; observed 0.12.0; previous v0.13.2 0.12.0; expected a different version
  PASS github-body-profile: observed no current final-review bodies yet; expected one physical line per prose paragraph or list-item paragraph
  ```

  `worktree publish` runs this same check in `--committed` form before any
  push, so the package cannot be published in this state. Both failing rules
  exist byte-for-byte in `scripts/release.mjs` at `01c2e32`, the executor's
  base; at that time the latest local tag was `v0.13.1`, whose skeleton
  component is also `0.12.0` with `src/` identical to this order's base, so
  the same two lines would have failed then.

- Merge shape against `main`, without touching the working tree: a temporary
  index (`GIT_INDEX_FILE` under `$TMPDIR`) captured the working tree as tree
  `2308756`, `git commit-tree` made a dangling probe commit `449dea8` with
  parent `01c2e32`, and `git merge-tree --write-tree 449dea8 main` reported
  content conflicts in `README.md`, `docs/control/current.md`,
  `docs/product/06-roadmap.md`, `docs/publication/everyday-ai-user-toc.md`,
  `docs/publication/software-engineer-toc.md`, `docs/work-orders/README.md`,
  and `package.json`; `docs/README.md`, `docs/lineage/idea-ledger.md`, and
  `docs/product/07-execution-guide.md` auto-merge cleanly. By class: four
  generated projections to regenerate (the control projection, the index, both
  edition locks) and three authored conflicts for the executor (the README
  release block, the adjacent activation completions in the roadmap, and the
  `scripts` block beside WO-038's license fields in `package.json`).
- Feedback edition pin: `FEEDBACK_SOURCE_PATHS` in
  `packages/skeleton/src/feedback-audit.ts` includes `package-lock.json` and
  `packages/skeleton/package.json`. Both, and the kernel and compiler
  manifests, differ between this tree and `main` by WO-038's license fields.
  The WO-041 edition's `subject` hash
  (`sha256:f0df21329af323d93b3c9f5eb3a94ef19fca4e1ac0543092ff590972f6d5988d`)
  is over this tree's bytes, so `feedback-evidence.mjs --check --edition WO-041`
  fails on the integrated tree, and the skeleton version bump in finding 2
  moves the same pin again. Main's refreshed WO-011 edition does not cover
  WO-041's transport changes either. A new bounded live verifier run after the
  sync is unavoidable.
- Publisher identity: this worktree's configured Git author equals the
  sign-off exemption pinned in `scripts/lib/contributions.mjs` on `main`, and
  equals the author of the WO-038 review commits, so the DCO check will not
  refuse a reviewer's commits after integration.
- Clean-room screen: a token screen over all 43 changed and new files for
  commercial tracker or ALM product names, predecessor-system names,
  managed-host, gateway, proxy, or internal-hostname shapes, and credential
  shapes found nothing. VER-001 and VER-002 each read every new and changed
  surface directly and found nothing; this review read every new and changed
  code, script, and documentation surface listed in §Method and agrees. The
  live receipt's free text is model output and was read directly: it names
  only this repository's own orders, theses, exclusions, roles, and rows.

## Blocking findings

### 1. Release target `v0.13.2` is published; the README block also breaks the one-version rule

The order's activation completion assigned `v0.13.2` on 2026-09-07 while
WO-038's 2026-09-06 completion had assigned the same target; the phase-two
plan anticipated this ("the first order in a wave to merge takes the next
version above the latest published tag; the second retimes at its sync step
with a dated note"). WO-038 merged first. The retime is therefore due, and it
touches the work order's H1, which is scope authority, the README release
block, and the roadmap, under 06-roadmap.md §Release boundary's requirement
of explicit operator authorization plus a dated migration note. The phase-two
plan's serial-assignment rule, merged by the operator in #42, and the
playbook's paired-wave step 4 ("Release-target changes retain their dated
operator-authority rule") are that standing authorization for this exact
case; the operator may confirm or redirect it at the `resume: fix` dispatch,
and the repair records it as a dated note either way.

Separately, the README block reads "prepares DotLn `v0.13.2`, a control-plane
patch above published `v0.13.1`", two strict versions inside the marked block
where `release-block` requires exactly one. The base's block and WO-038's
block each carry one. This is a criterion-6 write-back defect ("README 'What
runs today'") that the verifiers did not catch because neither ran the
preflight.

### 2. `@dotln/skeleton` needs a different component version

`packages/skeleton/src/reactor.ts`, `verification-protocol.ts`,
`worker-store.ts`, and `worker-transport.ts` are edited and
`loadouts/plan-refuter.ts`, `plan-refutation-protocol.ts`,
`plan-refutation-host.ts`, and `plan-refutation-fake.ts` are added, while
`packages/skeleton/package.json` stays `0.12.0`. The rule is not about
exported capability, which the order correctly says is absent; it is about
source bytes since the preceding tag. The roadmap's WO-041 completion
("Existing component versions ... remain unchanged"), the executor evidence
("Kernel, component versions, dependencies, and lifecycle event schemas are
unchanged"), and VER-001 §7 all state the observation that nothing was bumped
without applying the rule that something must be. A patch bump to `0.12.1` is
consistent with the order's patch classification; the executor chooses. The
bump also changes the lockfile's workspace entry and, through
`FEEDBACK_SOURCE_PATHS`, the feedback pin, so it must land before the fresh
feedback edition in finding 3.

Time-indexed: both rules were in force when the work was done, so this is a
behavioral gap in the evidence, not process scaffolding that had yet to be
invented.

### 3. The base moved after VER-002 and the integration is substantive

Sequence of record: VER-002 `VerificationCompleted` 16:20:02Z; WO-038 merge
16:23:01Z; `v0.13.2` tag 16:25:04Z; this dispatch 16:38:32Z. The executor and
verifier could not have synced; the operator dispatched final review on a lane
whose sibling had just merged. The phase-two plan §Concurrency step 6 and the
playbook's paired-wave step 4 place the sync in the remaining lane before final
review and route a substantive integration through `resume: fix` and a fresh
numbered verification. This integration is substantive on three counts: an
authored conflict in a manifest, a component version change, and a feedback
evidence edition that must be re-recorded through a live worker. A reviewer
merging `main`, bumping a version, and re-running a live evidence host would be
implementing and self-approving, which the final-review contract forbids.

## The verified deliverable stands

This section records what FINAL-002 need not re-derive, so the repair stays
bounded to the three findings.

- **Criterion 1 (deterministic committed-only subject).** VER-001 reproduced
  hash movement for all five input families and narrative exclusion in a
  throwaway repository; VER-002 confirmed the repair could not move them. This
  review read `scripts/lib/plan-subject.mjs` end to end: `committedReader`
  reads blobs by object id from `ls-tree`, `hashParts` frames by JSON without
  whitespace folding, the roles table and capability id/level cells are the
  only judged bytes from their files, `planPrompt` strips `path` and sends
  only the standard and the order fields. Agreed.
- **Criterion 2 (read-only compiled loadout).** `loadouts/plan-refuter.ts`
  pins the six questions as `acceptanceCriteria`, allows `repo.read*` and
  `report.emit`, denies write, git, remote, settings, and decision effects,
  zeroes the container's socket budget and supports, and compiles through
  `compileLoadout` with diagnostics thrown. `planRefutationAuthorization` in
  `reactor.ts` keeps the skeleton's single decider. VER-001 drove `authorize`
  against the envelope. Agreed.
- **Criterion 3 (closed result, structural holds, local-terms screen).**
  `validatePlanResult` is positively closed at both levels, constructs the
  three holds independently of the model's verdict, and de-duplicates by
  canonical form; `checkLocalTerms` matches contiguous token spans bounded by
  the longest normalized term across separators and lines and reports only
  surface, line, and count. VER-002 bound both repairs with fixtures that fail
  against the pre-repair modules by module swap. Agreed.
- **Criterion 4 (recorded live run).** The receipt pair records
  `claude-cli-print`, `2.1.263`, `claude-fable-5-1`, `max`, dispatched
  12:59:32.930Z and completed 13:09:21.372Z on 2026-09-07 over the ten-order
  sequence at `01c2e32`; verdict `pass`, zero holds; the self-referential
  disclosure is rendered by `renderPlanReceipt`. The rendered Markdown equals
  the deterministic rendering and the digest verifies (both checked by
  `plan check` here). The verdict on WO-041 is advisory and used nowhere in
  this report. Committing the receipt is the passing reviewer's duty; it stays
  staged through the repair.
- **Criterion 5 (evidence gate).** `checkPlanGate` dates enforcement from the
  first-parent introduction of `scripts/refute-plan.mjs`, exempts headings
  already present at that boundary, requires a committed subject, an actual
  transport, and an override event per hold read only from
  `docs/control/plan-refutations.jsonl`; `admitReceipt` enforces the chain,
  the same-subject and outside-criterion re-roll refusals, and the three-hold
  stop; `overridePlanHold` requires an ignored, untracked, hash-matched
  capture and the shared actor parser. The eleven fixture groups pass in the
  gate. Agreed.
- **Criterion 6 (write-backs).** All eight land and say something true about
  the mechanism; two of them carry the release sentences that findings 1 and 2
  require the repair to rewrite. The publication index moves 07
  §Operator-opened planning pass and 13 §UIFA tester to `implemented` and both
  locks are current.
- **Criterion 7.** The gate is green on this tree (above); `git diff --check`
  clean; `package.json` adds only the `plan` script and the `--edition`
  selection; `package-lock.json`, `packages/kernel`, and `packages/compiler`
  have no diff against `HEAD`.
- **Shared-surface changes.** `verification-protocol.ts` adds the plan request
  and result to the transport unions with a type guard; `worker-store.ts`
  excludes plan requests from the store; `worker-transport.ts` selects the
  plan budget and timeout; `feedback-evidence.mjs` gains `--edition` with an
  immutable write that refuses different bytes; `resume.mjs` exports
  `parseActor` and keeps its entry guard. Each is the smallest change that the
  named consumer needs. Agreed with VER-001's adjudication of the three
  out-of-criteria additions.

## Non-blocking observations, carried to the repair and to FINAL-002

1. **One feedback edition per order.** `--edition` accepts only `WO-NNN` and
   `immutableWrite` refuses different bytes for an existing edition, so the
   fresh edition that finding 3 requires cannot be written under `WO-041`
   while the current uncommitted files exist. Two honest routes: remove the
   uncommitted WO-041 edition files before the new live run, since they were
   never committed and the replacement supersedes them, recording that in the
   evidence README; or extend the edition identifier in a bounded way. The
   executor chooses and the verifier checks the choice. This is a design
   limit surfaced by the first paired wave, worth a ledger line.
2. **Sentences that the version bump falsifies.** The roadmap's WO-041
   completion, the executor evidence README's first paragraph, and the WO-041
   ledger entry's framing all say component versions are unchanged. Rewrite
   with the bump; do not leave a true-when-written sentence beside a manifest
   that contradicts it.
3. **Capability row wording.** `control.plan-refutation` reads "staged pending
   independent verification"; after VER-002 the honest phrase is pending final
   review and merge. A wording refresh at repair, not a level change.
4. **VER-001 O1 stands.** Once a planning pass dated after the introduction
   commit exists, any later order that edits the capability table, a sequence
   order file, a thesis section, or the judged roles table turns `npm test`
   red until a fresh refutation runs. WO-041's own row is the first such edit
   on record. The operator should meet this deliberately at the next planning
   pass.
5. **Same-day planning passes.** `refute-plan.mjs` selects the latest planning
   pass by date and then by ledger order; two planning-pass headings on one
   date would resolve to the one nearer the top of the ledger. Harmless today;
   worth a sentence in the receipt convention when it first matters.
6. **`.prettierignore` asymmetry** (VER-001 O4): the first manual redirect
   receipt remains formatter-owned; harmless.
7. **Wave-1 receipt duty.** The phase-two plan says the order that merges
   second records the wave receipt there (elapsed per phase from `status`,
   operator interventions, integration repair, time away). WO-041 is that
   order; this review's own timing belongs in it.
8. **`gh` inside the Claude Code sandbox** cannot read its configuration
   (WO-038 FINAL-001); if FINAL-002's publish refuses at that preflight, the
   operator runs the same command from the worktree outside the sandbox.

## Required repair

Ordered so that each step's evidence is valid for the next. Steps 1 and 2 are
the phase-two plan's sync procedure applied to this lane; steps 3 and 4 are
findings 1 and 2; step 5 is the consequence of all of them.

1. **Sync the base** (phase-two plan §Concurrency steps 1–4, 7). Confirm
   `origin/main` contains the WO-038 merge; preserve with
   `git stash push --include-untracked -m 'WO-041 sync 2026-09-07'` and record
   the message, never `pop` or `drop`; `git merge --ff-only origin/main`
   (the branch has no commits); `git stash apply`; regenerate the four
   generated conflicts rather than hand-merging them
   (`npm run resume -- next --work-order WO-041` for the projection,
   `npm run work-orders -- index`, `node scripts/check-publication.mjs --print-locks`
   into both lock lines); resolve the three authored conflicts. Record the
   sync (stash message, base before and after, conflicts by class) in
   `docs/evidence/WO-041/README.md`.
2. **Retime** (phase-two plan step 5; 06 §Release boundary). Heading
   `(v0.13.2)` becomes `(v0.13.3)`; the README block names exactly one strict
   version and describes the patch above the published license-posture
   release; the roadmap gains a dated retiming note under the WO-041 completion
   naming the superseded target and the reason.
3. **Bump `@dotln/skeleton`** to a different version in its manifest and the
   lockfile; correct the roadmap, evidence README, and ledger sentences in
   observation 2; `npm run release -- check-surfaces` must pass.
4. **Re-record the feedback edition** on the synced, bumped tree through the
   runbook in `packages/skeleton/README.md` (a live Codex worker), handling
   the edition-identifier limit in observation 1 explicitly.
5. **Rerun the evidence** (`npm test`, `npm run release -- check-surfaces`,
   `npm run plan -- check`, `git diff --check`), refresh the index, append the
   wave-1 receipt to the phase-two plan, then record
   `npm run resume -- repair-complete <actor-flags>`. `resume: verify`
   allocates `VER-003`, which should re-run criteria 4, 6, and 7 on the
   integrated tree, verify the version bump, the retime note, and the new
   edition, and leave criteria 1, 2, 3, and 5 as VER-002 left them unless the
   sync touched their files. `resume: final review` then allocates
   `FINAL-002`.

What FINAL-002 should check beyond the ordinary duties: `check-surfaces
--committed` on the committed series; the live receipt still validating at
`01c2e32`; the sync record and wave receipt; then the passing package (this
order's `PR.md` and five-section `RELEASE-NOTES.md`, distinct coherent
commits, `worktree publish`).

## Corrections applied by this review

None. A failing review does not touch the subject; every change named above
is repair work.

## Disclosures

1. **Self-referential instruments.** `scripts/resume.mjs` allocated this
   report and will record its verdict; WO-041 changes one line of it (the
   `parseActor` export), read here and inert for the CLI path.
   `scripts/work-orders.mjs index` was regenerated after dispatch and will be
   again after the verdict. The plan refuter judged WO-041 `thesis-advancing`;
   that verdict is advisory and unused.
2. **No destructive Git command ran.** The merge probe used a temporary index
   file under `$TMPDIR` and created only dangling objects; the working tree,
   index, and refs are untouched. `docs/intake` was not read.
3. **Effort evidence limit.** `CLAUDE_EFFORT=max` is visible in the shell as a
   launch selection; no effective-session readback exists for this harness, so
   the attestation is `self-reported`.
4. **Fixture suite reading.** This review read the fixture suite's structure,
   imports, isolation (fresh `mkdtemp` roots removed at exit, no network), its
   eleven group labels, and its 30 negative assertions, and relied on
   VER-002's module-swap evidence for the binding power of the two repair
   groups rather than repeating the swap.
5. **Time-indexing.** Findings 1 and 2 are judged against rules present in
   `scripts/release.mjs` at the executor's base. Finding 3 is judged against
   the paired-wave procedure merged in #42; that procedure names the executor
   lane as the actor, which is why it is repair.

## Method

Commands run, in order: `npm run resume --silent -- status --json`;
`npm run resume -- final-review`; `npm run work-orders -- index`;
`git diff --check`; `node scripts/check-publication.mjs`;
`npm run plan --silent -- check`; `npm run release --silent -- check-surfaces`;
the temporary-index probe (`git read-tree`, `git add -A`, `git write-tree`,
`git commit-tree`, `git merge-tree --write-tree --name-only`);
`git diff --stat 01c2e32 main`, `git diff --stat 01c2e32`,
`git diff 01c2e32 -- <each changed file>`; `git for-each-ref` over the release
tags; `git log` for the WO-038 merge and `origin/main`; `npm test`
(full gate, log under `$TMPDIR`). Files read in full: the work order,
VER-001, VER-002, the control segment, the executor evidence README,
`fixtures.txt`, `inspection-continuity.json`, the live receipt Markdown and the
JSON header, `plan-refuter.ts`, `plan-refutation-protocol.ts`,
`plan-refutation-host.ts`, `plan-refutation-fake.ts`, the four skeleton diffs,
`refute-plan.mjs`, `plan-subject.mjs`, `plan-receipts.mjs`, `terms.mjs`, the
`feedback-evidence.mjs`, `resume.mjs`, and `package.json` diffs, every
documentation diff, the receipt convention, the relevant sections of the
execution guide, the playbook, the phase-two plan, the concurrent plan, the
final-reviews README, the WO-038 final-review package, `contributions.mjs` on
`main`, and `FEEDBACK_SOURCE_PATHS`.
