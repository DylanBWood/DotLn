# WO-077 FINAL-001 — final review

**Verdict:** pass. `node scripts/launchpad.mjs export --update <dir>` now refreshes an existing export's kit from the running core commit: it requires a well-formed prior manifest, replaces only the kit files whose bytes still match that manifest's hashes, lists every locally edited kit file as refused and keeps it at its prior hash, adds the kit's new files, removes dropped ones only when unmodified, touches no instance or overlay file unless the instance has set `kit.applyInstanceActions` and the operator passes `--apply`, rewrites `UPSTREAM.md` and the manifest to the new commit, prints the kit's dated instance actions and the re-emit instruction, and refuses before any write when the manifest is absent or malformed or a kit input cannot be read. All five criteria are met at the integrated subject, which is byte-identical to the one VER-001 judged. This review found no new defect: the findings block is empty, VER-001's three follow-ups (F1 to F3, [D007](../../evidence/WO-077/decisions.md#wo-077-d007--verification-ver-001-pass-three-update-follow-ups-boarded)) stay boarded on FUP-eaad73517ca2a395, no touching follow-up row's seam was opened, and the planning receipt's criterion-1 known issue is carried unchanged under Known issues below. [D009](../../evidence/WO-077/decisions.md#wo-077-d009--final-review-pass-at-the-integrated-subject-the-three-boards-and-the-receipts-known-issue-carried) records the pass.

**Subject:** [`docs/work-orders/WO-077-launchpad-export-update.md`](../../work-orders/WO-077-launchpad-export-update.md) on branch `wo-077`, uncommitted over `main` at `c676909066d278c92cacd94d998a42a8fb5d4a9a`, which is also `origin/main` and the commit the newest tag `v0.73.1` points at: `main` has not moved since the order's activation, so this review's integration fast-forwarded nothing and resolved no conflict.

- VER-001 judged code identity `43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09`. The identity was read before integration and again after it and is unchanged, so the executor's fresh `npm test -- --review` row at that identity (recorded 2026-10-10T04:53:33.024Z, 29 suites, 81 fresh tasks, 1,094.4 s, exit 0) is the row this review's composed gate reuses. No behavioral byte was edited in this review.
- The order differs from `main` only in its heading's version label, `(v0.74.0)`, assigned at activation as the next minor above the observed v0.73.1 baseline ([D001](../../evidence/WO-077/decisions.md#wo-077-d001)). The five criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-077/` holds no `ideation.md`. The nomination provenance is WO-033's `--update` item, cut into this order at the operator's 2026-09-08 correction, amended by the 2026-09-28 planning pass (§10) and re-observed by the 2026-10-07 machinery-reset pass, whose refutation receipt 041 judges the order `aligned-with-findings` with one criterion-1 known issue, judged under Known issues below.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.296) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the executor's nine-case update fixture under the bounded runner, the identity readbacks, the integration, the printed affected checks and the two gates. VER-001 reproduced its own findings in its session, and no claim needed a worker.

**Process cost:** entry 91698 tokens; handoff 4768141 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 194cff2d-07a7-439f-8e17-80a453db3334`.

- Entry was observed at 2026-10-10T13:36:48.285Z, after 2 steps and 1 command: 65,697 cached input, 25,601 cache-write, 4 uncached input and 396 output tokens.
- Handoff was observed at 2026-10-10T13:56:48.327Z, after both gates had passed and the PR body, the release notes and this report's prose were written, 66 steps and 65 commands in: 4,457,743 cached input, 238,696 cache-write, 934 uncached input and 70,768 output tokens; subagents observed 0 of the cap of 20. These are cumulative transcript totals, almost all cached input, so they do not measure live context. The cost line, D009, the result transition, the commits and the publish step follow the cutoff.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate was not run fresh, because integration left the code identity unchanged and the runner composed a passing row from the executor's 80 reused tasks plus the always-fresh format preflight in 7.30 s; a fresh run at this identity cost the executor 1,094.4 s. The nine-case fixture (39.7 s) and the affected checks ran here in under two minutes of compute. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-077/FINAL-001.md`.

Read in full: the order; VER-001; the control segment; `handoff.md`, `self-review.md`, `fixtures.md` and `meta.json`; D001 to D007 and the helper's draft D008; the complete diffs of `scripts/launchpad.mjs`, `scripts/lib/config.mjs`, `scripts/test-launchpad.mjs` and `scripts/test-configuration-root.mjs`; the new `scripts/kit/KIT-ACTIONS.json`; the `scripts/kit/README.client.md` and `scripts/kit/CLAUDE.template.md` diffs; the product 07 write-back; the version, heading and publication-lock changes; the regenerated index, history, control, decisions-index and follow-up-register diffs; product 07 §Independent workflows and integration, §Verification review and attack and the Adjacent Repair paragraph of §Discipline; product 08 §PRs and commits; the planning receipt 041's WO-077 entry; the launchpad constants the new code relies on (`KIT_FILES`, `kitPath`'s inputs, `dirtyPinnedInputs`); `package.json` and `docs/control/budgets.json`; and WO-074 D010, the one touching row that names this order as a home.

Reviewed: the complete subject diff against `main` after integration: 16 modified tracked files (1,249 insertions, 72 deletions), of which the two source files and two test files account for 619, 16, 500 and 30 changed lines, plus the untracked order records (the control segment, evidence, verifications and this review's directory) and the new kit action file. The generated projections were judged by their generators' checks, not read line by line.

Lenses, and why:

- **Correctness and tests:** the update writes into a destination it does not own and decides by hash which bytes to keep, so the lens is whether any input or state reaches a write that the refusal rules should have stopped.
- **Authority and private data:** the command writes outside the project, performs instance actions only under two opt-ins, and reads a typed action file rather than prose; the lens is whether each effect stays inside what the instance and the operator admitted.
- **Design and coupling:** one preparation path now serves export and update; the lens is whether the split keeps the fresh export's contract and adds no second source of kit bytes.
- **Maintainer in six months:** two ownership predicates (`kitPath` for the manifest, listed paths for action destinations), a phrase rule that must not re-apply itself, and a manifest that records a new commit while keeping old hashes.

Goal alignment:

- **Traps:**
  - Carrying VER-001's pass across an integration without checking that the integrated bytes are the judged bytes.
  - Fixing F1, F2 or F3 in review because they are small and in the declared surface, which would certify my own behavioral change.
  - Treating the receipt's criterion-1 known issue (refused edits with no merge path) as a defect of this order rather than its recorded design.
  - Spending a fresh eighteen-minute review gate at an identity whose tasks already passed.
  - Widening the order onto WO-074 D010's suggestion that this order is a home for the publish check's author identity.
- **What I did:**
  - Read the code identity before and after integration, re-ran the nine-case fixture under the bounded runner, read the gate rows directly from the hot index, and ran every printed affected check.
  - Left F1 to F3 boarded on D007 and checked by source that each still describes the integrated bytes.
  - Judged the known issue against the order's Design and the receipt's reopening condition, and recorded why F2 narrows it.
  - Let the runner compose the review gate from the executor's passing tasks at the unchanged identity.
  - Left WO-074 D010 for WO-078 or planning, since this order's criteria and surfaces do not include the publish check.
- **NoOp:** leaving the order unreviewed keeps every export frozen at the commit it was written from, and WO-078 stays blocked behind it.

Integration: `npm run backup:intake` archived the three intake files into the session scratch, and `npm run worktree -- integrate WO-077 --intake-backup <archive>` checkpointed the work (`refs/dotln/checkpoint/WO-077/6`), kept the named stash `f048fc653a75250d284626a97375de10707d3ebd`, fetched `main` at the order's base, re-applied the work and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (v0.74.0 remains current above the observed v0.73.1), the decisions index, the follow-up register, meta, the work-order index and the publication locks; only the meter snapshot and the meter block of `PR.md` changed. Before the helper ran, `git ls-remote` showed origin's `main` at `c6769090` and its newest tag `v0.73.1` at that same commit. [D008](../../evidence/WO-077/decisions.md#wo-077-d008) records both bases, the unchanged identity, the carried-forward claims and the component check: `packages/`, `package.json`, `package-lock.json` and `docs/evidence/current.json` are byte-identical to `main`, so there is no version collision, no dependency and no evidence edition to re-mint.

## Earlier findings

- **VER-001 F1** (a kit-declared `rename-root` can move an instance root into a kit tree): stays boarded on D007 and FUP-eaad73517ca2a395. By source, `instancePath` in `planInstanceActions` refuses a destination that overlaps a reserved name or a listed kit path, while `kitPath` treats every path under the `scripts` and `packages/beacons` trees as kit-owned, so a destination under an unlisted part of a kit tree passes. The shipped `KIT-ACTIONS.json` declares no action, so no export can meet this at this release; only a kit author can declare such a move. Not repaired here: a reviewer writes no behavioral fix, and the defect breaks no criterion and no behavior `main` had.
- **VER-001 F2** (a kit file whose bytes already equal the incoming kit's is refused as locally modified for good): stays boarded. By source, `planUpdate` compares the current bytes with the prior hash alone. This is the hand-converged case of the receipt's known issue and the first thing a repair should add.
- **VER-001 F3** (an update whose instance write fails after the kit writes cannot be retried): stays boarded. By source, the kit replacements and removals run before the instance renames, and the next run requires every prior kit file to be readable, so a removed dropped file refuses the retry. D002 records that the update promises no crash-atomic transaction; the state needs a write failure after a passing preflight.
- **Adversary and improver** (found 2; fixed 2; recorded 0, [`self-review.md`](../../evidence/WO-077/self-review.md)): the two Codex workers at `implementation-ready` each found the same defect, a one-element array coerced into a valid commit or hash string. The fix is in `readPriorManifest`, which requires `typeof prior.commit === "string"` and `typeof entry.sha256 === "string"` before the regular expressions, and the `array-commit` and `array-hash` rows pass in my fixture run with the destination snapshot unchanged. Neither worker attacked action destinations, convergence or retries, which is where VER-001's F1 to F3 lay; VER-001's judgment of their claims carries.

## Criterion judgments

**Criterion 1:** met

- In my bounded run of the executor's fixture (`unmodified files update; edited and dropped edits keep prior hashes on repeated updates`, 4.53 s): the changed kit file holds revision B, the added file is present, the dropped file is gone, the two edited files keep their bytes and their prior hashes and are printed as `refused: … (locally modified; prior hash retained)`, the instance `README.md`, the overlay file and every non-kit file keep their hashes, the manifest commit and `UPSTREAM.md` name revision B, the output prints `kit files: 594 replaced; 1 added; 1 removed; 2 refused.`, `update without opt-in` and `re-emit: node scripts/harness.mjs emit`, and a second update refuses the same two files and changes no byte. The collision case shows a new kit path occupied by an instance file refused as `instance-owned collision` on two runs and kept outside the manifest.
- VER-001's S1 over the real 596-file kit is carried on its evidence: exactly the two edits refused, every other manifest hash equal to the file's bytes, `harness emit` and `harness check` passing inside the updated export, and a run from inside the destination and from its parent.
- By source, `planUpdate` gives each sorted path one of four kinds; `updateKit` writes only `add` and `replace` kit paths through a temporary sibling and rename, unlinks only `remove` paths, and writes the manifest last.

**Criterion 2:** met for the declared set

- In my run, the refusal case shows nine mutations (array commit, array hash, missing, malformed, escaping path, instance claim, missing kit file, directory, symlink) each exiting 1 with the path named and the destination snapshot unchanged, and an unreadable kit file refusing with the manifest still at revision A. The `--apply` case shows `--apply` without opt-in exiting 1 naming `dotln.config.json` with nothing changed, an invalid later phrase action refusing before any write, and an undeclared `shell` kind refusing with `KIT-ACTIONS.json: undeclared action kind shell`.
- With the opt-in alone, instance files keep their bytes; with the opt-in and `--apply`, the output says `opted-in update`, prints one `applied:` line per action, moves `docs/evidence` to `records/evidence`, records `roots.evidence` and `release.corpus`, and replaces the phrase once; the repeat prints `preserved/already applied:` for each and changes nothing. Declared child roots move with their parent and an existing configuration value survives a default. Without opt-in, the dated note prints each declared action with its own date.
- VER-001's variations are carried: nine manifest shapes including a symlinked or directory manifest, four configuration shapes, four malformed command lines, `--apply --apply`, an extra action field and an empty action list. F1 lies inside the declared kinds and is routed to follow-up as the criterion's last sentence directs.

**Criterion 3:** met

- In my run, `a running exported resident keeps its log, derived identity and pending cadence` passes (3.55 s): the case loads `ResidentHost`, `replayResident` and `materializeOrder` from the export's own `packages/skeleton/dist/src` and `scripts/lib`, records the away signal, arms the cadence, keeps the host open through an opted-in `--apply` update, finds the log byte-identical, restarts in a fresh process on the updated exported runtime, derives the same `WO-900` identity and dispatches once at `dueAt` 10. Its diagnostic line reads `{"runtime":"exported packages/skeleton/dist/src/resident-host.js","identity":"WO-900","logPreserved":true,"nextCadenceDueAt":10,"dispatched":1}`.
- D005 records that the first fixture expected an unarmed cadence to fire; the corrected case would catch a lost log, a changed identity or an unarmed cadence.
- Limit carried from VER-001: between the fixture's two commits the runtime sources do not change, so the update replaces the runtime with identical bytes; the criterion does not ask for survival across a changed runtime.

**Criterion 4:** met

- `scripts/kit/README.client.md` carries `## Taking upstream updates` and `## Opting in to instance actions`; its ownership paragraph and `scripts/kit/CLAUDE.template.md` now state that an update changes the contract only through opted-in actions.
- Product 07 §Where the control plane finds its documents lists `kit` among the optional sections and adds one undated sentence for `kit.applyInstanceActions` in place; the document measures 184,554 of its 196,693-byte ceiling, 156 bytes over `main`'s 184,398 and within the order's 200-byte cost. Of the ten co-writers the criterion names, none has landed on `main` since the base, so there was nothing to reconcile.
- D001 to D007 exist and are indexed; D008 is completed and D009 added by this review.
- The two publication source locks equal the printed values recorded in `audience-status-index.md`, and `npm run publication:check` passes with both outlines CURRENT.

**Criterion 5:** met

- `npm run test:docs` passes 32 of 32 suites in 116.30 s at the integrated tree (32 fresh tasks), recorded 2026-10-10T13:48:57.390Z. `npm test -- --review` at code identity `43d2cf9c…` composes a passing row from the executor's 80 reused tasks plus the always-fresh format preflight: 29 suites, 0 failed, 7.30 s, exit 0, recorded 2026-10-10T13:49:21.185Z as `host-gate:43d2cf9c…:npm test`, identity and build output unchanged; the executor's fresh run at this identity was 81 tasks in 1,094.4 s.
- `git diff --check` and `git diff HEAD --check` are clean and `npm run format:check` reports every matched file formatted. `package.json`, `package-lock.json` and `packages/` are unchanged from `main`, and the new code imports only `node:` built-ins and local modules, so no dependency is added.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **The kit action file is read without a guard.** `updateKit` takes `candidates.get(KIT_ACTIONS).bytes` from the prepared kit. The file is a kit file under `scripts/`, read at the running checkout's commit, and every commit that carries the update mode carries it; the one state where it is absent is a working tree whose `HEAD` predates the file while its uncommitted `scripts/launchpad.mjs` is this one, where the result is a type error before any write. Not a defect in the shipped contract.
- **Harness surfaces are written at mode 0644 by an update.** A fresh export's surfaces come from its own emit; an update writes them from the predicted bundle at 0644. The 15 tracked hook files are `100644` in Git and `.claude/settings.json` invokes each through `node`, and VER-001 ran `harness check` inside an updated export; no executable bit is needed.
- **A removed kit file leaves its directory.** By source, the `remove` step unlinks the file only; an emptied directory stays, which Git does not track and no reader opens. Inferred from the source, not run.
- **The note's date and the actions' dates differ in kind.** The `Instance-actions note (<date>)` line carries the run date and each `action:` line carries its declared date; both are printed, and the criterion asks for a dated note.
- **The client README overstates F1's check** ("overlaps with kit files … refuse" applies to listed files, not whole kit trees). D007 records the mismatch and the rule a repair must hold; the sentence becomes true when F1 is fixed.

## Implementation review

- **Correctness.** Every refusal the criteria name happens before the first destination write: the manifest is validated and every prior kit file read before the source build; the kit plan and, under opt-in, the whole action plan are computed before any write; the configuration draft is validated through the same closed loader the instance uses. The manifest records a refused file's prior entry, so a later update sees the same baseline, and it is written last. Replacements go through a temporary sibling and rename, so a symlinked or hard-linked destination file is never written through.
- **Design.** `prepareKit` is the exporter's existing pipeline up to the point where bytes meet a destination; D004 measured the alternative (a staged export read back) at equal bytes and more work. Actions are a closed table of three kinds with their fields, validated in one place and executed in another, so an invalid later action changes neither the kit nor an earlier target. The `alreadyApplied` phrase rule is the densest expression in the file; its comment states the case it exists for (a replacement that contains its old phrase), and the repeat case pins it.
- **Operator flow.** One command, one `--apply` flag, refusals that name the path or the configuration file, a summary line with four counts, one line per refused file and per action, and the re-emit instruction last. A refused file is resolved by hand and the next update says whether it still differs.
- **Authority and private data.** The command writes only under the destination it is given and the fixtures write only under the system temporary root, which the default roles' grants cover; the opt-in lives in the instance's own configuration; actions are typed kit data, never parsed from prose; no control event is appended. Nothing names a managed host, a forge account or an internal service.
- **Maintainer in six months.** The one thing a reader must hold is that two predicates decide ownership: `kitPath` for what a manifest may claim, and the listed kit paths for where an action may land. F1 is the gap between them, and D007's rule closes it by using the first predicate in both places.

## Follow-up register

`npm run plan -- followups --touching` lists 15 pending rows by textual match at the integrated tree, read over two pages. This review disposes none, because no listed row's seam was opened and no condition occurred:

- One is this order's own board, deferred on its own terms to the next repair or the next order that edits `scripts/launchpad.mjs`: FUP-eaad73517ca2a395 (D007, F1 to F3). The order's placement makes that WO-078.
- FUP-06de60fa5d19fe5a (WO-074 D010, a fork's publish check should read its operator author identity from instance data; natural home WO-077 or WO-078) matches this order by name. This order's criteria and surfaces do not include the publish check or `scripts/lib/contributions.mjs`, no fork exists whose publish could exempt core's identity, and widening the order in review would be new scope; the row stays untriaged for WO-078 or planning.
- FUP-44639ec9a751d8d1 (WO-075 D008, emit the Start-here directives from the compiled bundle) matches `CLAUDE.template.md`; this order edits only the template's ownership sentence. FUP-749c959a41178a3b (WO-075 D012, `resume status` and an absent projection) matches the fixture file; no case here runs `resume status` in an export.
- FUP-bd3e66761dc301ed (WO-190 D007, the seeded `docs/README.md` text in `scripts/launchpad.mjs`) matches the file this order edits; the seed text and `SEEDED_ROOTS` are unchanged.
- FUP-815e8662408881f1 (WO-073 D010, `repositories.<id>.linkHosts` validation) matches `scripts/lib/config.mjs`; this order adds the `kit` section and touches no repository validation.
- FUP-f1c7a256bec46737 (WO-054 D006, cold-start ceilings) matches product 07; `node scripts/harness-context.mjs --check` reports every role unchanged and within its ceiling in both skill roots (executor 28,112 of 29,246; reviewer 26,884 of 28,884; refuter unset). FUP-0a7c93eed06727ce (WO-187 D013, optimize product 07) matches the document this order grows by 156 bytes to 184,554 of 196,693.
- FUP-fb8cbeabbddef397 (ER4-005, a recurring gate's cost should not grow with closed history) matches product 07; this order adds a fixture to the launchpad suite (the update parent test ran 43.6 s in the executor's review row), which is suite cost, not history cost, and the row's own condition (the document gate's median) is not what it measures.
- FUP-67a07b670440cf5a (findings-block judgment) matches product 07; this report's block is measured and empty. FUP-4b70089b028849f0 (ER5-002) matches the register itself.
- The remaining four (FUP-acfe4bfda716d8fb, FUP-fd05316b6030ef73, FUP-cc27c2c1a82fed2c, FUP-e624167a7f6555f6) match the control projection, the README, the fixture file or this order by name, and this change opens none of their seams.

`npm run meta` reports the standing reopen candidate WO-150-D003 (`coldStartBytes.executor` above 24,576), which earlier reviews also recorded; the executor measures 28,112 and did not change here.

## Known issues and carry-ins

- **Refutation receipt 041, criterion 1** (a kit file the fork modified is refused on every later update and only listed, so forks drift from core's process text; reopen when an update in the operator's fork refuses the same kit file on two consecutive updates): not reopened. No starter or fork update has run; the condition is written against the operator's fork, which does not exist yet. The behavior is the order's Design: refusal is the reviewable path, and a three-way merge is a declined alternative. F2 narrows the issue for the case where no merge is needed, and D007's rule for it is the first thing a repair adds.
- **The order's own known issues** (2026-10-07): the stale items are corrected in the order text; the decided items hold at the subject (`kit.applyInstanceActions`, the typed action file, a refused file's retained hash, the exported `CLAUDE.md` as an instance file); WO-074 and WO-075 are merged (#195, #198), and WO-167 is history.
- **Design carry-in (WO-144)**: the update writes outside the project. The fixtures write under the system temporary root and this review's probe output under the session scratch; no operator-named root was needed.
- **Operator-review assumptions 1 and 2**: the operator made no choice; refusing a modified kit file stands as the default, and `--apply` is kept as the Design and criteria describe.
- **Cost line**: product 07 grew by 156 bytes against the order's 200-byte bound; the other listed costs (the command, the dated note, the field, the fixtures, the README sections) are the deliverables.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section minor edition for v0.74.0.

The proposed PR title is `:sparkles: An exported instance takes core's kit updates by manifest, keeps its local edits, and changes instance files only when it opts in`. Its gitmoji is `:sparkles:`, the catalog's entry for a new feature, because the change's purpose is a new command mode. The title leads with what the instance's operator gets; the four plan kinds, the three action kinds, the field name and the version belong to the body. The last five merged titles run 19, 19, 20, 18 and 19 words; this title's 22 words come from its three clauses (what is taken, what is kept, what needs consent), not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Times are 2026-10-10 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage <session>` (entry) | 13:36:48 | 0 | 91,698 tokens, dispatch scope |
| `npm run resume --silent -- status --json`; briefing | 13:36–13:37 | 0 | phase final-review; FINAL-001 allocated; one legal action |
| `npm run plan -- followups --touching` (two pages) | 13:40–13:44 | 0 | 15 rows matched; none disposed |
| `gateCodeIdentity` (worktree) before integration | 13:41 | 0 | `43d2cf9c…`, equal to VER-001's subject and the executor's rows |
| `git ls-remote --heads origin main`; `--tags origin 'v0.7*'` | 13:41 | 0 | `c6769090`; newest `v0.73.1` at `c6769090` |
| `npm run backup:intake` | 13:41:26 | 0 | archive of 3 files in the session scratch |
| `node --test --test-name-pattern='export update' scripts/test-launchpad.mjs` (bounded) | 13:42:12–13:42:51 | 0 | 9 passed, 0 failed; 39.7 s; the resident case and the byte-equality case printed their diagnostic lines |
| `npm run worktree -- integrate WO-077 --intake-backup <archive>` | 13:43:15–13:43:26 | 0 | checkpoint 6; stash `f048fc65…`; bases equal; no conflict; eight regeneration steps |
| `gateCodeIdentity` after integration | 13:43 | 0 | `43d2cf9c…` |
| `npm run publication:check` | 13:43:53 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/harness.mjs check` | 13:43:54 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 13:43:54 | 0 | every license and publish-refusal row passes |
| `node scripts/docs-check.mjs`; `npm run work-orders -- index --check`; `npm run format:check`; `git diff --check`; `git diff HEAD --check` | 13:43:59–13:44:30 | 0 each | 15 documents, 0 failures, product 07 at 184,554 of 196,693; both index pages current; all files formatted; clean |
| `node scripts/harness-context.mjs --check` | 13:44:30 | 0 | six roles unchanged in both roots, five within ceilings, refuter unset |
| `git diff main --stat -- packages/ package.json package-lock.json docs/evidence/current.json` | 13:45 | 0 | empty |
| D008 completed; `npm run meta`; `npm run format`; `git diff --check` | 13:46:40 | 0 | D008 indexed; one standing reopen candidate (WO-150-D003); clean |
| `npm run test:docs` | 13:47:00–13:48:57 | 0 | 32 passed, 0 failed, 116.30 s, 32 fresh tasks, recorded 13:48:57.390Z |
| `npm test -- --review` (background) | 13:49:12–13:49:21 | 0 | composed at `43d2cf9c…`: 29 passed, 0 failed; 80 tasks reused from the executor's fresh row and 1 fresh (format); 7.30 s; recorded 13:49:21.185Z |
| hot-index readback at this identity (read directly) | 13:51 | 0 | both rows above present with `identityUnchanged` and `buildOutputUnchanged` true |
| `node scripts/harness.mjs usage <session>` (handoff) | 13:56:48 | 0 | 4,768,141 tokens, dispatch scope |

After the gate figures were filled into this report, the PR body and the release notes, `npm run meta`, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D008's completion and D009;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, history and publication-lock projections.

No behavioral source was edited. The intake backup and the probe output live in the session scratch; the fixture's own cleanup removed its temporary repositories, and no scratch repository remains in the worktree.

Goal alignment outcome: matched. The integrated bytes are the judged bytes, each criterion was re-run or re-read here, the three boards stayed boarded and were checked by source, the receipt's known issue was judged against the Design rather than counted as a defect, the review row was composed rather than repeated, WO-074 D010 was left to its other named home, and the reviewed state is ready to commit.
