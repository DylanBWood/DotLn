# WO-075 FINAL-001 — final review

**Verdict:** pass. `npm run launchpad -- export <dir>` now carries the compiled runtime of kernel, compiler and skeleton, built from the commit's package sources after every pinned input is proven equal to the commit's blobs and the package tree is walked regardless of Git flags, and the Contributor harness bundle the export's own `node scripts/harness.mjs emit` writes from that runtime and `node scripts/harness.mjs check` verifies; a session the actual harness opens in such an export resolves its role skill by resume phrase and is refused a write dispatch by a generated hook naming the foreign holder. All seven original criteria are met at the integrated subject. This review found no new defect: the findings block is empty, the verifier's replace-ref hardening (D017) stays boarded, and one follow-up whose condition this order met (FUP-8fb7ae17dd0fad5b) is returned to open for planning.

**Subject:** [`docs/work-orders/WO-075-kit-runtime-and-bundle.md`](../../work-orders/WO-075-kit-runtime-and-bundle.md) on branch `wo-075`, uncommitted over `main` at `e8fd3e4c095ccfd44e6e45e756669b002d9b6297` after integration from the order's base `e3b386635ae1c22f4f9e583928f5dbcdedbb0cbc` (seven upstream commits: WO-188 with compiler 0.26.0, skeleton 0.56.0 and console 0.4.1 at v0.71.0, and WO-190 with console 0.4.2 at v0.71.1).

- VER-002 judged code identity `a5cefbc4cc6eaea828e04709bcc091d8f119f47ce98718b24b90dced79ca139d`, which this worktree still had at dispatch. Integration moved it to `b5af0ef955e1c649943eb9637462a611b3bbb10cce2f499aadf04365e2011078`, and two comment rewordings for main's new comment-labels check moved it to `918a229e74cdbdf6755645f35298d46576a20d83b37c5da6c9c9ef51388355a9`, the identity this review's gate ran at. No behavioral byte changed in this review: the two edits are the header comment of `scripts/launchpad.mjs` (the one authored conflict, resolved by keeping main's wording and appending this order's sentence with the identifier last) and one comment in `scripts/test-launchpad.mjs`.
- The order differs from `main` only in its heading's version label, retimed from `(v0.71.0)` to `(v0.72.0)` by the integration's release preparation. The seven criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-075/` holds no `ideation.md`, and the nomination provenance is WO-033 phase 3 cut into a bounded child at the operator's 2026-09-08 correction and amended by the 2026-09-28 planning pass, so there is no breakout receipt or promoted document to digest.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.295","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.295) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry and at handoff. Every claim the verdict rests on could be run in this session: the fixture suite, an export from a committed copy of the integrated tree against the operator's list with its rebuild and cold-start comparison, one live smoke in that export, and the affected checks.

**Process cost:** entry 193262 tokens; handoff 11971642 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 5e48c561-0072-467d-827f-9fe71a7b8dba`.

- Entry was observed at 2026-10-09T17:16:59.259Z, after 4 steps and 3 commands: 167,474 cached input, 24,840 cache-write, 68 uncached input and 880 output tokens.
- Handoff was observed at 18:11:56.611Z, after 125 steps and 124 commands, once the review gate had passed: 11,512,607 cached input, 357,803 cache-write, 1,164 uncached input and 100,068 output tokens. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Wall clock from dispatch to the handoff reading was about 55 minutes: the review gate took 1,646.9 s (27.4 minutes, the one full product gate), the two document gates 36.0 s and 117.2 s, the live smoke 158.5 s, the fixture suite 37.7 s and the export probe 9.5 s; integration with its regeneration took about a minute and a half.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate was run fresh because integration changed the code identity (main's seven commits and the two comment rewordings), so no executor row could be reused; the probes that bear on criteria 1 to 4 ran here fresh in under a minute, and the one paid live smoke took 158.5 s. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-075/FINAL-001.md`.

Read in full: the order; VER-001 and VER-002 with their probe records; the control log; `handoff.md`; D001 to D017 and the helper's draft D018; the adversary and improver reports with every disposition; `repair-f1.md` and `repair-f1-gates.json`; `export-run.md`; `edition-checks.json`; `cold-start.json`; the fixture transcript; the two live-smoke records; `scripts/launchpad.mjs`, `scripts/test-launchpad.mjs`, `scripts/bootstrap.mjs`, `scripts/harness-live-smoke.mjs`, `scripts/lib/harness.mjs`, `scripts/lib/paths.mjs`, `scripts/lib/document-gate-stubs.mjs`, `scripts/test-runner.mjs` and `scripts/test-process-debt.mjs` at their diffs; the three kit templates; main's diff since the base for every overlapping file and for `scripts/lib/comment-labels.mjs`; product 07 §Independent workflows and integration, §Verification review and attack, §Model-specific notes and §Operator recovery controls; product 08 §PRs and commits and §Release-note edition; the LEGAL, product 03 and capability-table write-backs in context; `package.json` and `docs/control/budgets.json`.

Reviewed: the complete subject diff against `main` after integration: the twenty-four modified tracked files (the README version claim, LEGAL, the capability table, product 03, the two publication locks, the order heading, the eight scripts, the three kit templates, and the generated control, decisions-index, follow-up-register, work-order-index and history projections) and the untracked order records (the control segment, evidence, verifications and this review's directory). The generated index, history and register diffs were judged by their generators' checks, not read line by line.

Lenses, and why:

- **Correctness and tests:** the central claim is byte provenance of a build that travels under a commit's name, and VER-001 showed how a passing clean fixture can hide a provenance hole.
- **Authority and private data:** the export writes a repository outside the project, spawns Git and the harness in it, and screens texts against a private list; the smoke launches a paid session.
- **Platform fit:** the kit is the slice WO-076, WO-077, WO-078, WO-082 and WO-118 build on, and the bundle prediction is a new coupling between the export and the compiler's emit.
- **Operator flow:** a stranger must get from a clone to a governed session with the client README, the bootstrap and the hook advisories alone.
- **Release surfaces and integration:** final review is acceptance, and main moved under the order by seven commits that changed the runtime the export carries.

Goal alignment:

- **Traps:**
  - Carrying VER-002's pass and the executor's gate row across an integration that changed the compiled packages the export carries and added a hook to the bundle.
  - Treating the version collision, the authored conflict or main's new comment check as findings, or conversely writing more than the integration list admits.
  - Spending a paid live session where a fixture would do, or skipping it where the integrated runtime differs from the one the records measured.
- **What I did:**
  - Re-derived criteria 1, 2 and 4 on the integrated tree with the fixture suite and an independent export probe, and re-established criterion 3 with one writer-isolation smoke on the integrated runtime, carrying the executor's records as the order's live rows.
  - Recorded the retime, the conflict and the comment rewordings in D018 as integration bookkeeping, ran every printed affected check and a fresh review gate, and changed no behavioral byte.
  - Ran the one smoke whose record criterion 3 rests on and declined the plain run, whose advisory mechanism this integration did not touch.
- **NoOp:** leaving the order unreviewed keeps the starter without a runtime and the five dependent orders blocked, and leaves main's compiler and skeleton changes unmeasured in an export.

Integration: `npm run backup:intake` archived the three intake files into the session scratch, and `npm run worktree -- integrate WO-075 --intake-backup <archive>` checkpointed the work (`refs/dotln/checkpoint/WO-075/10`, preservation commit `aa22bfcd`), kept the named stash `63259b8b3dd4113d096ad72c52459936523b0a62`, fast-forwarded the branch to `e8fd3e4c`, re-applied the work and stopped on one authored conflict in `scripts/launchpad.mjs`. After the resolution, `--continue` regenerated the runtime, the harness bundle and manifest (34 surfaces, main's `failure-observer` hook among them), the control projection, the release preparation (retimed v0.71.0 to v0.72.0 above the observed baseline v0.71.1, which D001 anticipated), the decisions index, the follow-up register (unioned by id), meta, the work-order index and history page, the publication locks and the selected console fixtures, and printed four affected checks, all of which pass below. [D018](../../evidence/WO-075/decisions.md#wo-075-d018) records both bases, the resolved paths, the retime, the evidence editions advanced to WO-188's by upstream (this order changes no registered source, so it owes no re-mint) and the carried-forward claims. No component version collides: this order changes no package.

## Earlier findings

- **VER-001 F1** (blocking, criterion 1: the status-based guard let an ignored source directory and an `assume-unchanged` edit reach the build under the commit's name): repaired by D015 and re-verified by VER-002, which reproduced both refusals before any destination write. The four regression cases the repair added passed fresh here, and the probe export from a committed copy equalled a rebuild of its commit by bytes and path set.
- **VER-002 F1** (minor, follow-up: the provenance reads honor `refs/replace`): stays boarded as D017 and FUP-5c2082d9fc28dbbf. This worktree holds no replace ref (`git replace -l` is empty), the integration added none, and the condition that reopens it (an export recorded from a repository with replace objects) has not occurred.
- **Adversary F1 to F13 and improver R1 to R28** (41 found; 39 fixed; 2 recorded): every disposition was read, and the fixture suite as it stands encodes the fixes that bear on the criteria: the writer-isolation smoke beside the plain run (F1, F2), the bin targets written executable so a committed clone is clean after `npm ci` (F4; my probe's `git status` after the install is empty), the compiled-plant screen (F9), the development-dependency pin check (F12), the full TypeScript source-form scanner (F13), the bundle-screen term that lives in every emitted skill (R1), bootstrap named for a fresh clone (R2), one composition rule for the operating contract (R3), the ignore check right after `git init` (R9), compilable extensions only (R11) and the `<=` cold-start comparison (R13). The two recorded residuals stand as D009's install-sharing limit and D008's hand-written Read directives (FUP-44639ec9a751d8d1).
- **D006, D012 and D016** stand: the plane/kit carry-in stays deferred with its reopening condition, the fresh-export status warning stays boarded (FUP-749c959a41178a3b; my probe export printed it again), and the owner-mode assertion accepts exactly the runtime's two Codex modes with identity and liveness checks, which is not a weakening.

## Criterion judgments

**Criterion 1:** met

- The fixture suite, run fresh under `node scripts/harness.mjs bounded` at the integrated identity, passes its rebuild case: every manifest-listed `packages/{kernel,compiler,skeleton}/dist/src` file equals the same path in a clone of the committed copy at the named commit rebuilt with the clone's own `scripts/build.mjs`, the rebuilt sets equal the manifest's, the forty pinned runtime files are listed, and no `.ts`, `.mts`, `.cts` or `.tsx` under a compiled package's `src`, no `dist/test` and no `.tsbuildinfo` travels.
- My export from a committed copy of the integrated tree ([final-001-observations.json](../../evidence/WO-075/final-001-observations.json)) wrote 592 kit files whose hashes all verify, 270 of them runtime files; an independent rebuild of the copy's commit in a fresh clone with the running install linked per entry produced the same 270 files with no differing byte and an equal path set. The copy's `scripts/launchpad.mjs` blob hashes to `76bbfa5b…`, equal to this worktree's bytes.
- The guard's four regression cases (index flags over a compiled source, the root configuration and an emit script; a missing tracked source; nested ignored directories with spaces; a same-byte symlink), the individually ignored source and the harmless `.DS_Store` admission all passed fresh. By source, `dirtyPinnedInputs` compares each tracked input's type, mode and bytes with the commit's blob and walks `packages` without Git's ignore traversal, and every refusal precedes `atomicBuild` and the first destination write.

**Criterion 2:** met

- Inside my probe export, `node scripts/harness.mjs check` exits 0 at 34 generated surfaces; appending one byte to `.claude/hooks/permissions.mjs` fails it with `harness drift: .claude/hooks/permissions.mjs`, and the restored bytes pass again. A scan of all 16 manifest-listed hook modules covered 212 static, dynamic and `new URL` specifiers and found no absolute, `file:` or drive-letter one; the fixture's own scan, with its refusal controls, passed fresh.
- The fixture also shows the snapshot ignored, a second emit changing no listed byte, `harness-context --check` resolving every installed Read directive, and the fresh clone's `snapshot-missing` advisory restored to a passing check by `bootstrap`. My probe's `harness-context --check` exits 0 in the export, where main's version now prints its measurement rather than a sentence.

**Criterion 3:** met

- One writer-isolation smoke ran in my probe export under its own bounded wrapper on the integrated runtime (compiler 0.26.0, 34 surfaces): [writer-foreign-live-final-001.json](../../evidence/WO-075/harness-live/writer-foreign-live-final-001.json) records the actual Claude Code 2.1.295 session (launch selector claude-fable-5 at xhigh, xhigh observed) resolving the executor skill from `resume: next`, two write dispatches refused by a generated hook with the seeded foreign holder named, the reservation still foreign at the end, the observer finished, no read outside the directed set, the export's own check at exit 0 and the scratch bundle equal to the export's. Process ids and start times are shapes; the record holds no absolute path.
- The executor's two records remain the order's live rows: [writer-foreign-live-001.json](../../evidence/WO-075/harness-live/writer-foreign-live-001.json) shows the same refusal on compiler 0.25.5, and [executor-001.json](../../evidence/WO-075/harness-live/executor-001.json) shows role resolution with the attribution judgment delegated as an advisory, which is WO-133's design and not a refusal. The plain run was not repeated: both clauses of the criterion rest on the writer-isolation record, and the integration did not touch the advisory mechanism.

**Criterion 4:** met

- Measured here with `measureColdStarts` over my probe export and this worktree: the export's `CLAUDE.md` is 6,832 bytes against core's 6,873, every role skill in both skill roots is byte-identical, and all twelve role/root cold starts are 41 bytes below core's. The fixture's document case asserts the same inequality against this checkout and passed fresh; the executor's [cold-start.json](../../evidence/WO-075/cold-start.json) recorded the same margin on the pre-integration export.

**Criterion 5:** met

- [D006](../../evidence/WO-075/decisions.md#wo-075-d006--fup-a058e82c0bbd9b6d-deferred) defers FUP-a058e82c0bbd9b6d with its reason and reopening condition, and the register row carries that disposition. `packages/skeleton/src/usage-observation.mjs` is unchanged against `main` (the integrated diff touches nothing under `packages/`), so no live feedback episode is owed; the deferred separate-launchpad scenario is not claimed as tested.

**Criterion 6:** met

- Product 03 §Platform and instance boundary describes the runtime built after the blob comparison and the package walk, the export's own emit and check, the repository the export initializes, the snapshot and the clone's bootstrap, in place with no dated paragraph; the file measures 179,463 bytes against the 194,488 ceiling after main's own edit to the same document. `docs/LEGAL.md` §Current state carries the dated runtime observation under the decided terms; the capability table carries `## WO-075 dated addition (2026-10-09)` with `launchpad.starter` at 1 — demonstrable; the decisions file holds D001 to D018; `npm run publication:check` reports 254 of 254 headings and both outlines CURRENT at the integrated tree after the locks were refreshed. These are the specified write-backs, not an independent legal determination.

**Criterion 7:** met

- Re-mints: none. The integrated diff changes no registered source, `package.json`, `package-lock.json` or `tsconfig.json`; the evidence editions are WO-188's, advanced by upstream, and the four current-edition checks run in the document gate below. The executor's [edition-checks.json](../../evidence/WO-075/edition-checks.json) reading (WO-074 revision 001) describes the pre-integration tree and is superseded, as D018 records.
- `npm run test:docs` passes 32 of 32 suites in 117.21 s at the integrated tree (32 fresh tasks; the four current-edition checks among them), after a first run that failed on the release-surfaces preflight because this review's release notes used angle-bracket placeholders the notes profile reads as raw HTML, which were reworded. `npm test -- --review` at code identity `918a229e…` passes 39 suites and 91 fresh tasks in 1,646.92 s (`launchpad` 52.37 s, `configuration-root` 8.75 s, `format` 7.63 s), recorded 2026-10-09T18:11:41.986Z, exit 0; no executor row was reusable at this identity.
- `git diff --check` is clean. No dependency is added.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **`harness-context --check` prints a measurement in the export.** Main's version of the script now prints its cold-start JSON and exits 1 only on an unresolved directive; the kit copies main's script, so the probe shows JSON where the executor's run showed a sentence. The exit code is the contract, and it is 0.
- **The seeded work-orders README convention still says the index is one page** (WO-190-D007, FUP-bd3e66761dc301ed, which names `scripts/launchpad.mjs`). WO-190 boarded it for planning as outside its files; this order edits the product convention next to it and not that sentence, so the row is left as WO-190 filed it and named here.
- **The executor's edition-checks record names WO-074 editions** while `docs/evidence/current.json` now names WO-188's. The record is a dated reading of the pre-integration tree; D018 records the supersession and the gate checks the integrated editions.
- **`resume status` in a fresh export warns about the absent projection** before the first activate; my probe export printed it. D012 boards it as FUP-749c959a41178a3b, outside this order's surfaces.
- **The plain live smoke was not re-run** on the integrated runtime; its claim (role resolution and a delegated attribution advisory) is unchanged in mechanism and the writer-isolation smoke re-established both clauses of criterion 3.
- **The owner-mode assertion accepts `codex-host` or `thread`** (D016). It asserts the dispatch thread's actor identity and each mode's liveness shape, matching `scripts/test-harness.mjs`; it is not a weakening.

## Implementation review

- **Correctness.** Every refusal that proves provenance precedes the build and the first destination write: the destination check, the kit-source check, `dirtyPinnedInputs` (blob equality by type, mode and bytes; the package walk; status as a diagnostic), the development-dependency pins and the local-terms screen over the predicted bundle. The bundle prediction and the spawned emit share one composition rule, so a drift between them is a refusal by path rather than a silent difference. The one known gap is the replace-ref read (D017), reachable only by writing a replacement object.
- **Authority and private data.** The export spawns Git and the harness with `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR`, `GIT_PREFIX` and `DOTLN_LAUNCHPAD` removed, so an inherited repository cannot capture the export's `git init` or its emit. The private list never leaves `checkLocalTerms`; the probe printed `present (615 texts checked)` and no term. The smoke scrubs the parent session's `CLAUDE*` variables itself, and both smoke records hold hashed session keys and shaped identifiers.
- **Platform fit.** `RUNTIME_PACKAGES`, `BUILD_INPUTS`, `EMIT_CLOSURE` and `KIT_WORKSPACES` are the four lists a later order extends; the fixture pins `EMIT_CLOSURE` to the static import graph so the list cannot drift from what the prediction loads. WO-077's update must re-emit rather than copy the bundle, which D003's reopening condition already states.
- **Operator flow.** The client README's seven steps were followed in my probe: commit, `npm ci --offline`, `harness check`, and in the fixture's clone case the hook advisory, `bootstrap` and the restored check. A refusal after the first write names the partial export and its missing manifest.
- **Maintainer in six months.** The four lists sit at the top of one file with their reasons; D002, D003 and D015 explain why the runtime is built rather than copied, why the export emits its own bundle and why status cannot prove provenance. The rule a maintainer must keep is that a new build input or source form extends both the guard and a mismatch case before the export can claim commit provenance, which D015's reopening condition states.
- **Clean-room screen (operator-review assumption 1).** The three edited templates, the client README and every seed text the export writes were read in full, and the decisions, export run and smoke records name paths as shapes. Nothing describes a specific managed host, gateway, vendor policy or internal service; the compiled output is this project's own `tsc` output of its own sources.

## Follow-up register

`npm run plan -- followups --touching` lists 29 pending rows by textual match at the integrated tree. This review disposes one and leaves the rest:

- **FUP-8fb7ae17dd0fad5b** (WO-074-D007: the export's own `npm test` once WO-075 carries the runtime) is returned to open, because its condition occurred here and wiring the export's test command is this order's non-goal under WO-074's operator-review assumption 2; planning decides the owning order (D011 names WO-118 and WO-082).
- Four are this order's own boards, untriaged for planning: FUP-44639ec9a751d8d1 (D008), FUP-749c959a41178a3b (D012), FUP-5c2082d9fc28dbbf (D017) and the deferred FUP-a058e82c0bbd9b6d (D006).
- FUP-bd3e66761dc301ed (WO-190-D007) names `scripts/launchpad.mjs` for the seeded single-page index sentence, which this change does not open; FUP-cc27c2c1a82fed2c (WO-188-D049) names `scripts/test-launchpad.mjs` for the bare-hex helper main already resolved in its D047; FUP-06de60fa5d19fe5a and FUP-e624167a7f6555f6 (WO-074's own boards) keep their seams.
- The remaining twenty match only on `scripts/lib/harness.mjs`, `scripts/lib/paths.mjs`, `scripts/test-runner.mjs`, `scripts/test-process-debt.mjs`, product 03, LEGAL, the root README or generated projections, and this change opens none of their seams.

`npm run meta` reports one standing reopen candidate, WO-150-D003 (`coldStartBytes.executor` above 24576), which the WO-074 and earlier reviews also recorded. This order does not change the executor briefing.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section minor edition for v0.72.0.

The proposed PR title is `:package: The launchpad export carries the commit's compiled runtime and emits its own harness bundle, so a fork's hooks govern sessions`. Its gitmoji is `:package:`, because the change adds compiled output to a distributed artifact. The title leads with what a fork gets and why it matters; the provenance guard, the repository and the bootstrap belong to the body. The last five merged titles run 17, 17, 17, 14 and 13 words; this title's 19 words come from its two clauses, not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Times are 2026-10-09 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `npm run backup:intake`; `npm run worktree -- integrate WO-075 --intake-backup <archive>` | 17:21:09–17:21:40 | 0, 1 | archive of 3 files; checkpoint 10; stash `63259b8b…`; one authored conflict |
| conflict resolution; `npm run worktree -- integrate WO-075 --continue` | 17:22:00–17:22:40 | 0 | nine projections regenerated; retimed to v0.72.0; D018 stub |
| `npm run publication:check` | 17:23 | 0 | 254/254 headings; both outlines CURRENT |
| `node scripts/harness.mjs check` | 17:23 | 0 | 34 generated surfaces |
| `npm run release -- check-surfaces --local` | 17:23 | 0 | six publish guards and the license pins pass |
| `node scripts/comment-labels.mjs` | 17:24, 17:25 | 1, then 0 | one order-lead comment; reworded; 541 files, 0 failures |
| `node --test scripts/test-launchpad.mjs` (bounded) | 17:26:01–17:26:39 | 0 | 22 passed, 0 failed, 37.74 s |
| export probe from a committed copy against the main checkout's list (bounded) | 17:26:39–17:26:49 | 0 | 592 kit files; 270 runtime files equal the rebuild; check, drift, specifiers, cold start as judged above |
| `DOTLN_LIVE_WRITER=foreign-live harness-live-smoke executor 001` in the export (its bounded wrapper) | 17:27:31–17:30:09 | 0 | passed; 2 refused write dispatches; holder named; 158.5 s |
| `npm run plan -- followups --apply` (FUP-8fb7ae17dd0fad5b to open) | 17:32 | 0 | register revision `8efa87fd…` |
| `npm run work-orders -- index --check`; `node scripts/docs-check.mjs`; `git replace -l`; `git diff --check` | 17:30–17:33 | 0 each | both index pages current; product 03 at 179,463 of 194,488; no replace ref; clean |
| `npm run meta` after D018 | 17:34 | 0 | D018 indexed; one standing reopen candidate (WO-150-D003) |
| `npm run format`; `npm run test:docs` (first run) | 17:40:1x–17:40:51 | 0, 1 | identity unchanged; 16 passed, 16 failed behind the release-surfaces preflight: `RELEASE-NOTES.md` line 3 held angle-bracket placeholders the notes profile reads as raw HTML |
| reword the notes; `npm run release -- check-surfaces --local`; `npm run format` | 17:41:2x–17:41:51 | 0 | `github-body-profile` passes for both files; identity unchanged |
| `npm run test:docs` | 17:41:51–17:43:56 | 0 | 32 passed, 0 failed, 117.21 s, 32 fresh tasks |
| `npm test -- --review` | 17:44:12–18:11:42 | 0 | 39 passed, 0 failed, 1,646.92 s, 91 fresh tasks at `918a229e…` |

After the gate figures were filled into this report, the PR body and the release notes, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes. Probe rows are in [`final-001-observations.json`](../../evidence/WO-075/final-001-observations.json), with local paths reduced to shapes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D018's completion and the follow-up disposition;
- `final-001-observations.json` and `harness-live/writer-foreign-live-final-001.json`;
- the resolved header comment of `scripts/launchpad.mjs` and one reworded comment in `scripts/test-launchpad.mjs`;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, history and publication-lock projections.

No behavioral source was edited. The intake backup, the committed copy, the probe export and its rebuild live in the session scratch; the fixture suite's own cleanup removed its temporary repositories; the live smoke's scratch repository is inside the probe export.

Goal alignment outcome: matched. Each criterion was re-derived from a fresh probe or check at the integrated subject, criterion 3 on the integrated runtime; the retime, the conflict and the comment check stayed bookkeeping; no behavioral byte changed, and the reviewed state is ready to commit.
