# WO-025 final review FINAL-001

**Subject:** branch `wo-025`, worktree `DotLn-wo025`, uncommitted working tree, 2026-09-02. `HEAD` and `origin/main` are both `46d3212f164a9b8bc8d887f5d83bf6748dbae33e`, the WO-024 merge published as annotated `v0.3.2`; the branch carries no local commits, so the entire subject is the dirty tree. At review open, before this review's own transition: twenty-eight tracked modifications (1210 insertions / 160 deletions against `HEAD`, including the two `docs/control` files) plus four untracked paths — `scripts/github-body.mjs` (196 lines), `scripts/test-github-body.mjs` (135), `packages/skeleton/test/cli.test.ts` (23), and `docs/verifications/WO-025/VER-001.md` (645); thirty-two `git status --porcelain` entries. The subject is exactly the tree VER-001 passed: a temporary-index `write-tree` of the working tree differs from checkpoints `refs/dotln/checkpoint/WO-025/2` (implementation-ready), `/3` (verify allocation), and `/4` (verdict) only in `docs/control/current.md`, the strictly appended `docs/control/resume.jsonl`, and VER-001 itself, which is absent from `/2` and `/3` and byte-identical in `/4` (§Dispatch and subject integrity). This review adds this report, its PR body, this order's `RELEASE-NOTES.md`, one bounded wording correction (§Corrections applied), and the lifecycle's own events.

**Authority:** `docs/work-orders/WO-025-version-bearing-surfaces.md` — objective, observed problem, design, six deliverables, nine acceptance criteria, evidence gate, closeout, non-goals, an operator-authorized scope expansion with its receipt, and a temporal-counterfactual ideation breakout receipt. Seven hunks differ from the activated text: the H1 and release-classification paragraph (the planner's "(version assigned at activation)" placeholder became `v0.3.3`), the expansion paragraph with both receipts and three added citations, the "Two gates, one check" clause rewritten around committed mode plus the new "Renderer-wrapped handoff prose" clause, deliverable 6, strengthened AC1, AC3, and AC4, the added AC9 with its evidence-gate extension, and two added non-goals. The objective, observed problem, the block, expected-version, and component-version design clauses, deliverables 1–5, AC2, AC5–AC8, and the closeout are byte-identical to the activated text. Both receipts impose named duties on this review (§Receipts, provenance, and the clean-room screen).

**Prior reports:** `VER-001` (pass; all nine criteria confirmed first-hand with six probes of the verifier's own; seven observations for the final reviewer; no findings). Complete sequence: one report.

**Reviewer:** Claude Fable 5.1 (`claude-fable-5-1`), **effort `max`**, in Claude Code with sandboxed Bash; macOS 15.6 (darwin 24.6.0, arm64), node v22.2.0, npm 10.8.0, git 2.55.0, Prettier 3.9.6, TypeScript 5.4.5. WO-025 permits any capable model as reviewer. Every command in this report ran first-hand from this worktree inside the sandbox; nothing is quoted from the executor's or verifier's transcripts. No subagents were used. This report, the PR body, and the release notes are authored under the renderer-wrapped convention this order introduces: one physical line per paragraph or list item. The convention binds `PR.md` and `RELEASE-NOTES.md`; applying it to the report as well is this reviewer's choice, since `docs/final-reviews/WO-*/` is formatter-exempt and GitHub renders either layout the same.

**Verdict: WO-025 passes.** The defect the order was cut for is gone: the front page states the release of the source it is in, that claim and every component version are checked against origin tag truth before the branch is pushed and again at close before `npm ci`, the skeleton banner is derived rather than transcribed, and reviewed handoff prose is renderer-wrapped from this package forward while every historical byte stays put. All nine acceptance criteria are met on first-hand evidence. Beyond re-running the executor's suites twice, this review confirmed the two behavior anchors the receipt cites from their sources, judged the suites with a fifteen-mutant drill in an isolated mirror (thirteen caught, two documented survivors), and drove the operator's own future command on the reviewed tree against a scratch origin carrying the real seven tags, which passed the surface gate at close and published annotated `v0.3.3` with the expected manifest and these notes verbatim. That drive surfaced one finding no earlier report names: `release close` executes whatever `scripts/release.mjs` the main checkout holds when the process starts, so the merged gate runs at this order's close only if `main` is fast-forwarded before the command (§Findings, item 1). It is a handoff precondition the operator's own history already satisfies, not a defect in the deliverable, and it is stated in the PR body and the handoff below. One bounded wording correction was applied. Nothing acceptance-relevant was changed by this review.

## Self-referential instruments — disclosure

07-execution-guide.md §Discipline requires naming the instruments that are part of the deliverable under judgment; AC6 makes it an acceptance clause for this order.

1. **`scripts/release.mjs check-surfaces` is both deliverable and evidence** for AC1–AC4 and AC6. Its PASS/FAIL report is what the executor's fixtures and VER-001's probes assert against. Mitigation here: the dry run asserts properties the checker does not report — the tag object's manifest components and `previousRelease`, the verbatim presence of every reviewed section in the edition, the Release body shape, the refs on the scratch origin, and the `gh` and `npm` stub logs — and the drill inverts the relation by asking whether the suites fail when the checker is broken.
2. **`scripts/github-body.mjs` sits on both sides.** `worktree publish` and `release close` validate with the same profile that `npm test` exercises, and this review's own `PR.md` and `RELEASE-NOTES.md` were written to satisfy it. Mitigation: the rules were compared against GitHub's documented line-break behavior fetched at source, three profile mutants were shown to fail the unit suite, and the profile's refusals of two drafts of this review's own notes (an HTML-comment marker literal, an angle-bracket placeholder) were witnessed as the notes contract working, then rewritten rather than worked around.
3. **`scripts/resume.mjs` allocated this report's path** and appended `FinalReviewRequested`. It is byte-identical to `origin/main`, confirmed before use; it is a fail-loud append-only log with a regenerated projection.
4. **This order's own release close is the first close-time drive of the gate it ships** (AC6). That drive is the operator's post-merge action. The dry run below is the closest a pre-merge session can come to it without touching `origin` or `gh`, and it is where item 1 of §Findings was learned. Nothing in this session performed or implied a release, a Release, a push, or a tag against the real repository: origin still advertises seven tags and one `main` head, and `refs/heads/wo-025` is absent from it.
5. **The reviewer authored `RELEASE-NOTES.md` and `PR.md` and is judging the contract they satisfy.** The contract (five headings, `None.`, the strict Markdown subset, the renderer-wrapped profile, refusal at publish and close) is the executor's deliverable; this review only wrote files that meet it. Both were validated through the deliverable's parser and profile, through the bare `check-surfaces` preview (which lists both paths under the profile rule), and through the dry run's real `close`. Their editorial adequacy is the operator's to judge at merge.

## Dispatch and subject integrity

`docs/control/current.md` named WO-025 at phase `verified` with `final-review` as the only legal action. Before invoking the transition I inspected the `resume` mapping in `package.json` (unchanged: `node scripts/resume.mjs`) and confirmed `git diff scripts/resume.mjs` is empty against both `HEAD` and `origin/main`. `npm run resume -- final-review` ran inside the ordinary sandbox with no approval escalation, allocated `docs/final-reviews/WO-025/FINAL-001.md`, moved the phase to `final-review`, and minted checkpoint `9f0c78148eb998afe271ca0b6cc64e06bf276189` (`refs/dotln/checkpoint/WO-025/5`). `docs/control/resume.jsonl` is a strict append over `HEAD`: `git diff --numstat` reports four added lines and zero removed before this review's transition (`WorkOrderActivated`, `ImplementationReady`, `VerificationRequested`, `VerificationCompleted`), five after it, plus the `FinalReviewCompleted` the pass records.

Subject identity was established with git objects, not with the lifecycle script: a temporary index (`GIT_INDEX_FILE`, `git add -A`, `git write-tree`) captured the working tree exactly as the checkpoint mechanism does, and `git diff-tree -r --stat` against each checkpoint reported:

| Checkpoint | Differences from the working tree |
| --- | --- |
| `/2` implementation-ready (`f6e8c348…`) | `docs/control/current.md`, `docs/control/resume.jsonl` (+3), `docs/verifications/WO-025/VER-001.md` (added) |
| `/3` verify allocation (`237352a0…`) | `docs/control/current.md`, `docs/control/resume.jsonl` (+2), `docs/verifications/WO-025/VER-001.md` (added) |
| `/4` verdict (`2d60efba…`) | `docs/control/current.md`, `docs/control/resume.jsonl` (+1) |

Every deliverable blob is therefore identical across the implementation-ready, verify-allocation, and verdict checkpoints and the working tree; the verifier changed nothing in the deliverable, and VER-001 has not changed since its verdict was recorded.

No destructive git command ran in this worktree; nothing was restored from a checkpoint; the shared repository's worktree list and stash were not touched. The repository still has exactly seven tags (`v0.2.0`–`v0.3.2`), origin advertises the same seven and a single `main` head, and `refs/heads/wo-025` does not exist on origin. `.claude/` carries no change, tracked or untracked, and the only ignored material in the worktree is intake, `node_modules`, and build output.

## Receipts, provenance, and the clean-room screen

Both receipts require the reviewer to digest the raw batch and confirm the transformation. I read both local captures, `docs/intake/notes/WO-025-expanded-ideation-2026-09-02.md` (677 bytes) and `docs/intake/notes/WO-025-temporal-counterfactuals-2026-09-02.md` (2427 bytes); both are ignored by `.gitignore:4`, and `git ls-files docs/intake` lists only the three `.gitkeep` placeholders.

- **Screen result: clean.** Both captures are personal and public material only: a display-width complaint, a school game and a calculator movie, and public distributed-systems and computational-geometry concepts. No employer code, configuration, identifier, hostname, proprietary API shape, credential, or internal URL appears in either, and none of the terms `CLAUDE.md` names as must-not-re-enter appears in the subject.
- **No verbatim lift into the subject.** Grepping every tracked and untracked file outside intake for the raw batches' distinctive words finds "atrocious", "side scrolling", "speed of light", "multiverse", "overthinking", and "school game" in exactly one file: VER-001's own screening sentence, which lists the words it screened for. "4K ultrawide" appears in the work order's expansion paragraph and the ledger's source line as a two-word factual description of the reported condition; the operator's sentence is nowhere in the repository. The only "TI-83" outside VER-001 is founding-era ledger content already on `origin/main`. A future grep-based screen should exclude verification reports, or it will keep finding its predecessors.
- **The ledger headings are exactly the ones the receipts promise:** `WO-025 implementation and operator-expanded presentation scope (2026-09-02)` and `WO-025 ideation breakout — temporal fidelity and bounded future reachability (2026-09-02)`, appended above the WO-024 entry without rewriting existing entries.
- **The two official behavior anchors support the stated rationale.** VER-001 substantiated both locally without fetching; this review fetched both. GitHub's line-break documentation states that in issues, pull requests, and comments a single newline renders as a line break, that in `.md` files it does not, and that two trailing spaces, a trailing backslash, or an HTML `br` tag produce a hard break in `.md` files — which is exactly the distinction the profile encodes (two-space and odd-backslash endings are intentional breaks; a bare newline inside a paragraph is an accidental wrap in a PR or Release body). Prettier's `proseWrap` documentation states the default is `"preserve"`, that `"always"` wraps prose to `printWidth`, and that Markdown wrapping is preserved by default because services such as GitHub comments render line breaks; the repository had opted into `"always"` and now returns to the documented default.
- **The synthesis preserves the operator's uncertainty and refuses the physical claims.** 11-proteino.md §Candidate — time fidelity and bounded future reachability keeps world time, engine wall time, observation availability, and the record/ingest milestone distinct, separates authority-to-act again, states that the event is "a representation choice — not proof that an event is a physical time quantum", marks the engine rate unresolved, presents the envelope only as a conservative broad-phase hypothesis where `T ∩ E = ∅` is the sole sound pruning condition, and closes with "This is a future research direction. It changes no kernel clock, event schema, simulation engine, or roadmap rung." The ledger tags the two open items `preserved`, not `adopted`.
- **Consistency with the existing contracts holds.** 02-domain-model.md's pinned `EventEnvelope` carries `occurredAt` and no ingest field, which is what the candidate states; the `v0.1.0` rung still describes "cadence with virtual time"; 06-roadmap.md §Post-1.0 horizons gains only the catalog pointer and retains "no application, simulation, or embodiment choice may distort Horizon 1"; no rung, exit criterion, or version moved; the audience index classifies the new section as `vision`; `npm run publication:check` is `CURRENT` for both editions with 150/150 headings indexed.
- **Governance.** The executor rewrote the H1 from the planner's placeholder to `v0.3.3`, which the draft itself instructed ("Before `resume -- activate`, rewrite this H1 to carry exactly one strict `vX.Y.Z`"), so the executor completed a step the activation helper skipped rather than inventing scope; `v0.3.2` is the latest published tag locally and on origin and `v0.3.3` is the next patch; the append-only activation event was neither replayed nor edited; the correction is disclosed in the classification paragraph, the ledger, and the map. The scope expansion and the breakout both came from the operator in-session, which `docs/verifications/README.md` names as a valid source of new authority, and each carries a receipt with the required review duties.

## Final evidence summary

### The unchanged `npm test`, twice

Run from this worktree inside the sandbox before this review's artifacts existed and again after `RELEASE-NOTES.md`, `PR.md`, and the map correction were in place (the report itself is formatter-exempt and read by no suite). Both runs: `All matched files use Prettier code style!`, `GitHub body profile tests passed`, then the seven shell suites — fixture temp-root, publication checker, backup-intake, resume, checkpoint, worktree (`GitHub PR target, authentication, and committed-body fixtures passed`, `worktree tests passed`), and release (`release surface version and component fixtures passed`, `release close surface gates ran after sync and before npm, tag, or GitHub mutation`, `release tests passed`) — then `tsc -b --force` and `# tests 78 / # pass 78 / # fail 0`, exit 0. The fixture roots under the session temporary directory were counted before and after each run and left no new residue; the three entries that pre-dated this session were listed and left alone.

### Static checks

- `git diff --check`: exit 0, no output, before and after this review's artifacts.
- `npm run publication:check -- --print-locks`: `PASS index coverage: 150/150`, `PASS dual-voice links`, locks `ff04564ea8c460f2c26b25c088bc63abe37835d3a246e2a3a7b68186bfd47932` (everyday, unchanged from §10) and `f1ce1362211b50dc2cdc3e4e4a52dae2726a8996cb47495c90124a8f83bd892d` (software engineer), matching `docs/publication/staleness-demonstration.md` §11 and the software-engineer TOC.
- Kernel: `cmp` of all four `packages/kernel/src` files against `origin/main` reports no differences; `git diff --stat origin/main -- packages/kernel` is empty; no untracked kernel paths; `packages/kernel/package.json` remains `0.1.0`.
- Historical bytes: `git diff --stat origin/main -- docs/final-reviews docs/verifications` changes exactly `docs/final-reviews/README.md` (+12, the convention document this order must update); every numbered `FINAL-NNN.md`, `VER-NNN.md`, `PR.md`, and `RELEASE-NOTES.md` is byte-identical to `origin/main`, and the only untracked paths under either tree are this order's own directories.
- The new profile over every historical body at `origin/main`: all eleven fail it (WO-003 25, WO-004 36, WO-005 34, WO-006 66, WO-007 93, WO-012 42, WO-013 84, WO-015 84, WO-024 PR 115, WO-024 notes 78, WO-101 48; 705 in total), matching VER-001's counts. None was rewritten.
- Dependencies and schema: `package.json` changes only the `test` script; `package-lock.json` changes only the workspace mirror of the skeleton version; `scripts/github-body.mjs` imports nothing; `docs/releases/tag-manifest.template.json` is byte-identical to `origin/main` at `"schemaVersion": 1`.

### Surfaces, banner, and the reviewer's own bodies

```text
$ npm run release -- check-surfaces
PASS release-block: observed v0.3.3; expected v0.3.3 (work-order target v0.3.3; latest published v0.3.2)
PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.3.2 0.1.0; expected no bump required
PASS component-version @dotln/skeleton: src changed; observed 0.3.0; previous v0.3.2 0.2.0; expected a different version
PASS github-body-profile: observed docs/final-reviews/WO-025/PR.md, docs/final-reviews/WO-025/RELEASE-NOTES.md; expected one physical line per prose paragraph or list-item paragraph
```

Before this review wrote its bodies the fourth line read `observed no current final-review bodies yet`, as VER-001 recorded. `npm run skeleton` prints `@dotln/skeleton v0.3.0 — Repo Gardener + Seiri`. `RELEASE-NOTES.md` (34 lines, longest 703 characters) parses as the five-section edition and passes the profile; `PR.md` (40 lines, longest 781 characters) passes the profile. The notes contract refused two earlier drafts of the notes — a literal HTML-comment marker inside inline code ("HTML comments are not allowed in reviewed notes (line 7)") and an angle-bracket placeholder ("raw HTML is not allowed in reviewed notes (line 9)") — which is the strict subset working as documented; both were reworded.

## Independent re-derivation

### Mutation drill — does the suite catch a broken deliverable?

An isolated mirror of the tracked and untracked subject files (no `.git`, `node_modules` symlinked) ran each suite green first (body-profile unit suite, `test-worktree.sh` in 10 s, `test-release.sh` in 38 s), then fifteen single-point mutations, each on a fresh copy, each verified to have applied exactly once.

| Mutant | Change | Suite | Result |
| --- | --- | --- | --- |
| M1 | `explicitHardBreak` always true | body unit | caught |
| M2 | an even trailing-backslash pair counts as a hard break | body unit | caught |
| M3 | four-space indent exempts a line even directly after prose | body unit | caught |
| M4 | release block accepts any single strict version | release | caught at the stale-block fixture |
| M5 | expected version is always the latest tag | release | caught at the first PASS assertion |
| M6 | component rule always passes | release | caught at `surfaces_component` |
| M7 | component diff scope widened to the whole package | release | caught at `surfaces_non_source` |
| M8 | `close` continues after a failed surface check | release | caught (`npm ci` ran; verbatim-report equality failed) |
| M13 | strict-version regex loses its suffix lookahead | release | caught (`v0.2.1-beta` accepted) |
| M14 | malformed-marker detection disabled | release | caught |
| M9 | `publish` drops the `--body-file` profile check | worktree | caught at the wrapped-body fixture |
| M10 | `publish` ignores a failed surface check | worktree | caught (report wrapped by the `gh` preflight error) |
| M11 | committed mode drops the closed-phase requirement | worktree | caught at the hidden-control fixture |
| M15 | `publish` drops its second profile call over the notes | worktree | survived |
| M12 | banner re-hardcoded to the literal `v0.3.0` | skeleton node test | survived |

M15 survives because the committed `check-surfaces` that `publish` runs first already profiles `docs/final-reviews/WO-NNN/RELEASE-NOTES.md` at `HEAD` and refuses with the same message, so the second call is redundant defense in depth, not a gap; the `--body-file` call (M9) is not redundant, since a body may live at a non-canonical path. M12 survives because `cli.test.ts` compares the printed version with the manifest's current value, which the literal happens to equal; it will catch the regression the moment the version moves, and VER-001 proved the derivation by mutating the manifest to `9.9.9`. Both are recorded under test thinness, not scored.

### Dry run — the operator's future command on the reviewed tree

A scratch bare origin was cloned from the real repository's object store (all seven annotated tags, `main` pinned to `46d3212f…`, no other heads). A scratch subject clone received the working tree's exact bytes on `wo-025`, recorded `final-review-result pass` with its own copy of `resume.mjs`, committed, and was merged into scratch `main` with a `--no-ff` merge commit as the PR merge would be. A separate scratch "main checkout" clone, with `git`, `npm`, and `gh` stubs on `PATH` (raw remote URLs, logged evidence commands, a `gh` that refuses `release` calls before the tag exists on the origin and records `create`), real `dist` output, and a `node_modules` of symlinks so the toolchain check reads TypeScript 5.4.5, then ran `release close WO-025 --publish`.

Publish-time gate on the reviewed commit, from the subject clone: `check-surfaces --committed WO-025` printed the four PASS lines above and exited 0.

Close, with the main checkout fast-forwarded to the merge commit before the command (as the operator's reflog shows for the last three closes), stdout captured to a file:

```text
PASS release-block: observed v0.3.3; expected v0.3.3 (work-order target v0.3.3; latest published v0.3.2)
PASS component-version @dotln/kernel: src unchanged; observed 0.1.0; previous v0.3.2 0.1.0; expected no bump required
PASS component-version @dotln/skeleton: src changed; observed 0.3.0; previous v0.3.2 0.2.0; expected a different version
PASS github-body-profile: observed docs/final-reviews/WO-025/PR.md, docs/final-reviews/WO-025/RELEASE-NOTES.md; expected one physical line per prose paragraph or list-item paragraph
Running npm ci...
Running npm test...
Running node packages/skeleton/dist/src/cli.js...
Published annotated v0.3.3 (4c63aa6dae14a42466e568c845d4c24f736cefa0) for bf7a1fd0356bd69e09c78b04a32f23356341ccc4; GitHub Release created. Main is clean and between work orders.
```

The `npm` stub logged `ci` then `test`, both after the surface report; the `gh` stub logged `--version`, `auth status --hostname github.com`, `release view v0.3.3 --repo github.com/DylanBWood/DotLn --json …`, and `release create v0.3.3 --repo github.com/DylanBWood/DotLn --verify-tag --title DotLn v0.3.3 --notes-file …`, in that order, with no ambient `GH_REPO`/`GH_HOST` leak. The scratch origin gained exactly `refs/tags/v0.3.3` as a tag object. `manifest-from-tag v0.3.3` reports `application v0.3.3`, `previousRelease v0.3.2`, `schemaVersion 1`, and `components {"@dotln/kernel":"0.1.0","@dotln/skeleton":"0.3.0"}`, with the four evidence rows at exit 0 and toolchain `node v22.2.0 / npm 10.8.0 / typescript 5.4.5`. `notes v0.3.3` renders the five sections with one `### WO-025 …` subsection each plus `### Derived from the diff` and `### Machine-derived release evidence`; all five reviewed sections appear verbatim, and the stub Release body equals the edition plus the two-command pointer line, its longest physical line 703 characters. The rerun reported `v0.3.3 is already published from bf7a1fd0…; GitHub Release existing`, preceded by the surface report in its equal-version shape (`latest published v0.3.3`; both components `src unchanged` against `v0.3.3`), and `check-surfaces --committed WO-025` from the closed checkout passes the same way. `release list` shows `v0.3.3 … WO-025` after the seven real tags.

A first attempt, made with the main checkout cloned before the merge and not pulled, published an equally correct `v0.3.3` — same components, notes verbatim, Release created — but printed no surface report at all. Captured to a file and to a pipe, the output was identical, so it was not buffering: the process had loaded the pre-merge `scripts/release.mjs` (the WO-024 version, which has no `check-surfaces`) before fast-forwarding `main`, and kept running it. That is §Findings, item 1.

## Verification-sequence soundness

VER-001 meets every duty the order and the guide place on it: it discloses six self-referential instruments, digests both receipts against their raw captures, confirms the nine criteria with probes that share no helper with the executor's suites, characterizes the profile's boundary precisely, proves historical bytes unchanged, runs the bare preview by hand, and names its deferrals honestly (AC6's close-time clause and AC9's then-nonexistent bodies). Its counts were re-derived here where cheap — the historical-body failure totals, the four PASS lines, the 78 node tests, the publication locks — and all agree. Its one measurement this review could not reproduce exactly is the deletion count (161 there, 160 here), which differs only by the state of the generated control projection at each measurement and does not describe the deliverable. No VER-001 statement is contradicted by this review's evidence.

## Adjudications

### 1. The executor amended the work order's authority text

The seven hunks in §Authority. Ratified: the H1 rewrite was instructed by the planner's own draft and is substantively correct (`v0.3.2` is the latest tag, `v0.3.3` the next patch); the expansion, its receipt, deliverable 6, AC9, and the strengthened AC1, AC3, and AC4 record operator authority given in-session and the executor's own stricter commitments, which widen what the executor must prove rather than narrow it; the breakout receipt records an ideation dispatch that changes no deliverable. Objective, observed problem, the original design clauses, deliverables 1–5, AC2, AC5–AC8, and closeout are untouched, so the acceptance bar the planner set was not moved down anywhere.

### 2. The operator-authorized presentation expansion

In scope by the operator's live message, with a receipt, a clean-room screen, two public anchors now confirmed at source, and an executable subject the verifier and this review both exercised. `.prettierrc.json` changes only Markdown prose wrapping; `printWidth` remains the code preference; the change is load-bearing (VER-001's counterfactual) and its check passes without a corpus-wide rewrite; the formatter-exempt historical artifacts are byte-identical; the operator did not authorize and the subject does not perform any edit of remote PRs. Ratified.

### 3. The temporal-counterfactual breakout's write-backs

Vision-only by construction: a candidate section, a catalog pointer, an index row, and a ledger entry, with no clock, schema, simulator, helper, dependency, or acceptance change, and the operator's explicit continuation authorization on record. The synthesis preserves uncertainty and consistency as checked above. Ratified.

### 4. The changed `worktree publish` refusal wording (VER-001 observation 2)

The closed-phase gate moved from a projection string match into committed `checkSurfaces`, which reads the committed log and defeats the hidden-projection attack VER-001's probe C and the suite's hidden-control fixture demonstrate. The user-visible consequence, a changed refusal message, is now named in the notes' "Read before upgrading". Accepted.

### 5. The profile's disclosed blind spot and the `2024.` ordinal (VER-001 observation 5)

Both fail open toward accepting prose, both are the documented subset limit, and both are named in the notes and the PR body. Accepted; a richer grammar is its own bounded work if ever needed.

### 6. Diagnostic label and gate asymmetry (VER-001 observation 7)

A malformed notes file at close is reported under `github-body-profile` with the real defect in the observed half; `worktree publish` fails closed when the latest tag is absent locally while `release close` fetches it. Both are honest and safe; both are carried as seams for a later cleanup rather than corrected here, since either change is a code change outside this review's lane.

### 7. README links and the skeleton README heading (VER-001 observations 3 and 4)

The `v0.2.0` links carry their own version and so make no currency claim; the `# @dotln/skeleton 0.3.0` heading agrees with the manifest today but nothing checks it. Both are carried as candidates; neither is an acceptance defect.

### 8. The reviewer's artifacts under the new convention

This package is the first forward example the order calls for. The bodies were validated by the deliverable and by the dry run; the report follows the same layout by choice (§Reviewer). The operator sees the result rendered in the PR.

## Corrections applied by this review

One correction, in the wording lane `docs/final-reviews/README.md` grants, proven contained by diffing against checkpoint 5 and followed by a re-run of the checks it could affect (`prettier --check`, `git diff --check`, and the second full `npm test`, all clean).

1. **`docs/planning/work-order-map.md`, the WO-025 catalog row.** Its evidence, preflight, and disposition cells read "active at `v0.3.3` …", "current package remains subject to independent verification", and "active implementation; legal next transition is implementation-ready after the full evidence gate" — true when the executor wrote them, false beside a passing VER-001 and this report. Following WO-013 FINAL-001 §Corrections item 1 and WO-024 FINAL-001 §Corrections item 1, they now read "`v0.3.3` tagging patch assigned above published `v0.3.2`; activation target forward-corrected and operator-authorized presentation expansion received on 2026-09-02; VER-001 pass; FINAL-001 pass; reviewed state committed and awaiting operator merge; `v0.3.3` remains unpublished pending a fresh release close, which is the first close-time drive of `check-surfaces`" (with links), "satisfied — active branch includes WO-024 and published `v0.3.2`; operator merge and a fresh release close remain required", and "passed VER-001 and FINAL-001; awaiting operator merge and a fresh `v0.3.3` release close". `git diff` against checkpoint 5 shows one line changed and the pinned formatter re-padded nothing. No other row changed.

The three files this review adds — this report, `PR.md`, and `RELEASE-NOTES.md` — are artifacts the process requires of a passing review, not corrections. Every other path is byte-identical to checkpoint 5.

## Findings

**None blocking.** No acceptance criterion is unmet and no behavioral or evidence defect was found in the deliverable. One new observation carries an operator precondition; the rest are recorded and not scored.

1. **`release close` runs the tooling that `main` holds when the process starts.** `npm run release -- close WO-NNN --publish` loads `scripts/release.mjs` from the main checkout before it fast-forwards `main`, so a checkout still at the pre-merge commit runs the pre-merge tooling to completion: it fast-forwards, tags, and creates the Release correctly from the new tree, but the merged `check-surfaces` gate does not execute at that close and no report is printed. The dry run demonstrated both branches on the reviewed tree. The operator's own reflog shows `pull: Fast-forward` entries on `main` at 13:24, 17:06, and 20:00 on 2026-09-02, each before the corresponding close (the `v0.3.2` tag was cut at 20:05 and carries the merged five-section edition, and its GitHub Release exists), so the precondition has been met in practice for every close since `v0.3.0`; earlier reflog entries are the close command's own `merge origin/main: Fast-forward`. This is not a defect in the deliverable — no script can load code it does not yet contain — but it bounds AC6's third clause: this order's close is the first close-time drive of the gate only when `main` is fast-forwarded before the command. The handoff below and the PR body say so. Candidate hardening for a later order: after synchronization, compare the running script's blob with `HEAD:scripts/release.mjs` and refuse with "main was fast-forwarded; rerun the same command so the merged tooling runs" when they differ.
2. **Test thinness (drill M12, M15).** The banner test cannot distinguish a re-hardcoded literal until the version next moves; the second notes profile call in `publish` is redundant with committed `check-surfaces`. Candidates for WO-018's consolidation.
3. **The activation-preflight gap is now a trend** (VER-001 observation 1): two consecutive orders activated with the planner's placeholder in the H1. For the operator's planning pass, not for this review.
4. **The work-order map's WO-024 row is stale** ("awaiting operator merge and a fresh `v0.3.2` release close" although `v0.3.2` is published); pre-existing on `main` and outside this order's row, left for the next planning pass rather than widening the correction, as WO-024's review did for the WO-013 row.
5. **Backfill disposition is still pending.** The public Releases list holds only `v0.3.2`; `v0.2.0` through `v0.3.1` remain without a GitHub Release, and no reviewed artifact records a decision not to backfill. Carried from WO-024.
6. **Executor model and effort are not in a committed artifact** (the structural gap WO-013, WO-015, and WO-024 recorded); the verifier's and this reviewer's are in their headers.

### Candidates considered and not sustained

- *The missing surface report in the first dry run is an output defect in `close`.* Not sustained: with stdout to a file and to a pipe the output was identical, and the process was demonstrably running the pre-merge script; the merged script prints the report before evidence on the same tree (finding 1).
- *VER-001's screening sentence is a verbatim lift of the raw batch.* Not sustained: it reproduces six isolated words of personal-anecdote vocabulary as a screening record, contains no employer material or identifier, and is exactly what the Clean Room floor exists to catch; noted so later screens exclude verification reports.
- *The component rule should also refuse a bump without a source change.* Not sustained: an explicit non-goal, and VER-001's probe B confirms the reverse is not enforced.
- *The report should be hard-wrapped like every prior `FINAL-NNN`.* Not sustained: the convention document binds bodies, exempts the report directory from the formatter, and the operator's stated preference and the repository's new default both favor the renderer's wrapping; the choice is disclosed in §Reviewer.

## Acceptance criteria

| # | Criterion | Verdict | First-hand basis |
| --- | --- | --- | --- |
| 1 | One block, one strict version; malformed shapes refuse; outside versions ignored; no currency sentence outside the block | met | bare `check-surfaces` PASS; suite fixtures green twice; drill M13, M14 caught; README read in full, the surviving version mentions are historical (`v0.2.0`) or a future exit criterion (`v1.0.0`) |
| 2 | Expected-version rule, five fixture cases | met | suite green twice (`surfaces`, `surfaces_lower`, `surfaces_first`); drill M4, M5 caught; dry run: expected `v0.3.3` above `v0.3.2`, then `v0.3.3` equal to itself after the tag |
| 3 | Component rule, five clauses | met | suite green twice (`surfaces_component`, `surfaces_non_source`, `surfaces_new_component`); drill M6, M7 caught; real subject: kernel unchanged at `0.1.0`, skeleton changed `0.2.0` → `0.3.0` |
| 4 | Gates: publish pushes nothing on failure; close refuses after sync and before `npm ci` with the report verbatim, including the linked-worktree case; hidden bytes and a stale projection cannot override | met | suite green twice (`surfaceclose`, `surfaceclose_linked`, `bodyclose`, hidden-control and stale-block publish fixtures); drill M8, M10, M11 caught; dry run: report before `npm ci` |
| 5 | Banner derived from the manifest; test binds it; skeleton `0.3.0` with dated note; kernel unchanged, `cmp` clean | met | `npm run skeleton` line; 78/78 node tests; `cmp` of four files; `packages/skeleton/README.md` dated note read |
| 6 | Self-referential instrument: block names the assigned version, own `check-surfaces` passes before publish, reviewer discloses, close is the first close-time drive | met | four PASS lines here; disclosure above; the close-time clause is the operator's action, bounded by finding 1 and stated in the handoff |
| 7 | Write-backs landed; WO-007 PR body untouched; roadmap names each axis's owner | met | `docs/final-reviews/WO-007/PR.md` byte-identical to `origin/main`; 06-roadmap §Release boundary "Version ownership stays separated" read; every deliverable-5 and deliverable-6 surface read in the diff |
| 8 | `npm test` green; `git diff --check` clean; no new dependency; no `.claude/` change; manifest schema unchanged | met | two green runs; clean; `package.json` and lockfile diffs read; `.claude/` unchanged; template byte-identical at schema 1 |
| 9 | Renderer-wrapped prose: formatter preserves; profile fixtures; publish and close refuse wrapped bodies; this order's bodies follow the profile; historical artifacts byte-identical; historical re-derivation accepted | met | `.prettierrc.json` asserted by the unit suite; drill M1–M3, M9 caught; both bodies pass and are listed by the bare preview; eleven historical bodies unchanged and all fail the profile; `notes v0.3.2` renders from the hard-wrapped notes in the dry run's `release list` |

Design clauses respected: expected version from release truth, not the latest tag; component rule one-directional; committed mode folds `HEAD:docs/control/resume.jsonl`; `check-surfaces` absent from `npm test`; no touch of `packages/kernel/src`, of `packages/skeleton/src` beyond the banner, of the manifest schema, cadence extraction, the evidence command list, or the publication editions' locked base revisions. Non-goals respected: no README generation, no post-tag README PR, no badge, no root `package.json` version, no kernel bump, no reverse enforcement, no historical or remote-PR edits, no code `printWidth` change, no WO-024 or WO-018 scope.

## Remaining deviations and open questions

None requires a change to the subject.

- **Publish step returned to the operator.** `gh --version` in this session fails with `failed to read configuration: open ~/.config/gh/config.yml: operation not permitted`, so `npm run worktree -- publish` refuses at its `gh` preflight after the surface check and before any push (fail closed), as for WO-006, WO-007, WO-013, and WO-024. The reviewed commit is made here; the operator runs the exact command from this worktree outside the sandbox.
- **Close-time precondition (finding 1).** After merge, and only under a fresh `resume: release close`, fast-forward the main checkout to the merge commit first (`git pull --ff-only origin main`), then run `npm run release -- close WO-025 --publish` from it, outside the sandbox and where `gh` is authenticated. It runs `check-surfaces` against the merged `HEAD` before `npm ci`, cuts annotated `v0.3.3`, and creates its GitHub Release; the README block is provably current at that tag for the first time. If Release creation fails after the tag push, rerun the same command.
- **Attribution:** the reviewed commit carries a plain subject and no attribution trailer, per the operator's standing rule and the repository's hand-authored history.
- **Ledger duty:** discharged by the executor's two entries; no entry is owed for this review's wording correction.
- Before `resume: release close`, if the main checkout's globally ignored, non-disposable `.claude/settings.local.json` is still present, move it out; the release-close gate refuses it by name.

## Proposed PR

- **Title:** `:sparkles: WO-025: the front door names the release of its source, checked at publish and close, with renderer-wrapped review prose` — a new lifecycle capability (the surface gate at both mutation boundaries and the body profile), the `:sparkles:` precedent being WO-024's release projection and WO-004's release close.
- **Body:** `docs/final-reviews/WO-025/PR.md`, committed alongside this report and `RELEASE-NOTES.md`.

## Ready to merge — handoff

Closeout from here, per the playbook: `final-review-result pass` is recorded before the reviewed commit (it also makes the map's "FINAL-001 pass" cell true); the reviewed state is committed with a plain subject. The operator then runs, from this worktree outside the sandbox:

```bash
npm run worktree -- publish WO-025 --title ':sparkles: WO-025: the front door names the release of its source, checked at publish and close, with renderer-wrapped review prose' --body-file docs/final-reviews/WO-025/PR.md
```

The helper runs `check-surfaces --committed WO-025` on the committed tree, validates `RELEASE-NOTES.md` and both bodies against the profile, preflights `gh`, pushes only `wo-025`, opens the PR pinned to `github.com/DylanBWood/DotLn`, and prints the release-close handoff. The operator retains merge authority. After the merge, and only under a fresh `resume: release close`, fast-forward the main checkout to the merge commit and then run `npm run release -- close WO-025 --publish` from it; the merged gate runs before `npm ci`, and the close may cut annotated `v0.3.3` with its GitHub Release.

## Method

Single reviewer, single session, no subagents. Read order: the execution guide's dispatch, closeout, and discipline sections, the control projection and log, the work order and its diff from the activated text, VER-001 in full, the final-review README, the WO-024 final review and its PR body and notes for the package shape and publish precedent, the two raw intake captures, then every changed file's diff and all three new files in full, with the gate orderings in `worktree.mjs` and `release.mjs` read from source rather than inferred from fixtures. Subject integrity was established through git objects, not through the lifecycle script. Evidence was re-established first-hand: two full `npm test` runs, the static checks, the bare surface preview, the banner, the kernel `cmp`, the publication locks, the historical-body profile sweep, and both behavior anchors fetched at source. The suites were judged by a fifteen-mutant drill in an isolated mirror, and the operator's future close was driven twice on the reviewed tree against a scratch origin cloned from the real object store — once from a pre-merge main checkout, once from a fast-forwarded one — with the real repository's reflog and public Releases list consulted to interpret the difference. The scratch mirrors lived in the session scratchpad and were removed; the three residue entries that pre-dated this session were listed before and after and left alone. The one correction was applied after the first evidence run and the affected checks were re-run. Nothing was restored from a checkpoint, no destructive git command was used, and no real remote, tag, or `gh` was touched.
