# WO-073 FINAL-001 — final review

**Verdict:** pass. A registered repository's class is now a link group the host adapter applies: its declared checks join every member order's compiled `requiredEvidence` and its declared supports are linked in the existing group, with unknown checks, unknown supports and authority widening refused by layer; a registration may declare one profile document that activation checks for containment and readability and the executor reads on demand; and a registration's declared machine logins and link hosts reach the pull-request observer through the target request, so a review bot that runs as a user account is classed as automation and a bot comment may link to a declared host. All six criteria are met at the integrated subject, which is byte-identical to the one VER-001 judged. This review found no new defect: the findings block is empty, the verifier's two follow-ups (D010 and D011) stay boarded, and no follow-up row's seam was opened by this change.

**Subject:** [`docs/work-orders/WO-073-repository-class-and-profile.md`](../../work-orders/WO-073-repository-class-and-profile.md) on branch `wo-073`, uncommitted over `main` at `b06c60812cf7a533d9a2286479893abe6904c4b2`, which is also the order's base: `main` had not moved, so integration fast-forwarded nothing and resolved no conflict.

- VER-001 judged code identity `acc59de0a031256eb8c5519429f221571382aad7d575bc3c9a8b14d33b853c34`. The identity was read before integration and again after it and is unchanged, so the executor's passing `npm test -- --review` row at that identity (recorded 2026-10-09T19:28:37.062Z, 89 fresh tasks, 1,534.475 s, exit 0) is the row this review's gate reuses. No behavioral byte was edited in this review.
- The order differs from `main` only in its heading's version label, `(v0.73.0)`, assigned at activation ([D001](../../evidence/WO-073/decisions.md#wo-073-d001)) and left current by the integration's release preparation. The six criteria are the original text.
- No ideation receipt exists for this order: `docs/evidence/WO-073/` holds no `ideation.md`. The nomination provenance is WO-033 phase 2, cut into a bounded child at the operator's 2026-09-08 correction and amended by the 2026-09-28 pass (§10) and the 2026-10-02 pass (§6 and §9, which decided criterion 4 from WO-065 D015). The catalog row's receipt 033, 038 and 039 known issues were read: none of their reopening conditions occurred (a registration without a profile still activates; no profile statement conflicted with a class check or support in one order; no transient read refusal was observed; no cold-start acceptance was recorded).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.296","model":"claude-fable-5-1","effort":"xhigh","source":"claude-session-readback"}

Human actor: the operator dispatched `resume: final review` in a Claude Code session and made no choice about the verdict. The harness version comes from `claude --version` (2.1.296) and the model is the session's model as the host reports it. Effort `xhigh` is the host's `CLAUDE_EFFORT`, read by this session; it is the selected effort, not a measured effective one. The order recommends any effort for the reviewer.

Subagent plan: none, against a `subagentCap` of 20, with 0 admissions observed at entry. Every claim the verdict rests on could be run in this session: the three criterion suites and the process-debt oracle under the bounded runner, the cold-start measurement, the tree-wide search for registration writers, and the printed affected checks.

**Process cost:** entry 143950 tokens; handoff 5998541 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope from `node scripts/harness.mjs usage 85e0c18c-3729-4b19-9524-749f0e2a12d4`.

- Entry was observed at 2026-10-09T20:22:09.922Z, after 3 steps and 2 commands: 92,127 cached input, 51,106 cache-write, 36 uncached input and 681 output tokens.
- Handoff was observed at 2026-10-09T20:39:00.250Z, after the review gate had passed, 70 steps and 67 commands in: 5,675,409 cached input, 262,557 cache-write, 1,000 uncached input and 59,575 output tokens; subagents observed 0 of the cap of 20. These are cumulative transcript totals, almost all cached input, so they do not measure live context.
- Reasoning tokens and dollar cost are unavailable (`counter-unavailable`).
- Tradeoff: the review gate was not run fresh, because integration left the code identity unchanged and the executor's row at that identity is the gate the order's evidence line names; the focused suites, the cold-start measurement and the affected checks ran here in about a minute of compute. No matched two-way cost experiment was performed and no unmeasured saving is claimed.

## Method

Dispatch: `resume: final review`, recorded by the session hook; allocated report `docs/final-reviews/WO-073/FINAL-001.md`.

Read in full: the order; VER-001 with [`verify-001-probes.json`](../../evidence/WO-073/verify-001-probes.json); the control log; `handoff.md`; `self-review.md`; D001 to D011 and the helper's draft D012; `meta.json`; `docs/repositories/README.md`; the complete diffs of `scripts/lib/config.mjs`, `scripts/lib/authority-grants.mjs`, `scripts/resume.mjs`, `scripts/lib/pull-request-observer.mjs`, `scripts/lib/target-publish.mjs`, `scripts/lib/review-comment-loop.mjs`, `scripts/lib/vertical-primitives.mjs`, `scripts/lib/vertical-runtime.mjs`, `scripts/resident-bind.mjs`, `scripts/worktree.mjs`, `scripts/test-runner.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, the two generated executor skills, the harness manifest, the three package files, the five migrated fixtures and the three new or extended test files; the product 03 and product 07 write-backs; the two cited decisions WO-119-D001 and WO-071-D001; product 07 §Independent workflows and integration, §Verification review and attack, §Discipline and §Where the control plane finds its documents; product 08 §PRs and commits; the 2026-10-02 pass §6 and §9 and the 2026-09-28 pass §10; `package.json` and `docs/control/budgets.json`.

Reviewed: the complete subject diff against `main` after integration: 37 modified tracked files (963 insertions, 68 deletions) and the untracked order records (the control segment, evidence, verifications, the profile root, the role oracle and this review's directory). The generated index, history, decisions-index and follow-up-register diffs were judged by their generators' checks, not read line by line.

Lenses, and why:

- **Correctness and tests:** the class layer rewrites the host adapter's graph and the loader gains a section that every registration must now satisfy, so the fixtures and a tree-wide search for registration writers decide whether anything `main` had stops loading.
- **Authority:** a class could widen what a member order may do; the floor must stay monotone and the exact-grant route must stay the only widening.
- **Operator flow:** an activation refusal and an observation refusal both stop a run; the declared set and the advisory must be exactly what the order says.
- **Maintainer in six months:** a new configuration section, a new document root and a four-caller request field.

Goal alignment:

- **Traps:**
  - Carrying VER-001's pass across an integration without checking that the integrated bytes are the judged bytes.
  - Treating D010, a defect in a declared surface that breaks no criterion, as a reason to fail or to repair in review, or leaving D011's unmigrated generator as the only writer of its kind without checking the tree.
  - Spending a fresh 25-minute review gate at an identity whose tasks already passed.
- **What I did:**
  - Read the code identity before and after integration, re-ran the three criterion suites, the oracle and the cold-start measurement at the integrated tree, and ran every printed affected check.
  - Left D010 and D011 boarded as the verifier filed them, and searched the whole tree for every file that writes `repositoryClass`: the WO-111 seed is the only one without a `classes` declaration.
  - Reused the executor's review row, which the runner reports as the passing tasks at the unchanged identity.
- **NoOp:** leaving the order unreviewed keeps `repositoryClass` an opaque name nothing reads, keeps a review bot running as a user account from ever being dispatched, and keeps WO-083 blocked.

Integration: `npm run backup:intake` archived the three intake placeholders into the session scratch, and `npm run worktree -- integrate WO-073 --intake-backup <archive>` checkpointed the work (`refs/dotln/checkpoint/WO-073/6`), kept the named stash `91967b9d97df2ff3e0153980783f36d3e27aac10`, found `main` at the order's base, re-applied the work and regenerated the runtime, the harness bundle and manifest, the control projection, the release preparation (v0.73.0 remains current above the observed v0.72.0), the decisions index, the follow-up register, meta, the work-order index, the publication locks and the selected console fixtures; only the meter snapshot and the meter block of `PR.md` changed. [D012](../../evidence/WO-073/decisions.md#wo-073-d012) records both bases, the unchanged identity, the carried-forward claims and the component check: `main` carries skeleton 0.56.0 and this order advances it to 0.57.0 with the console pin and lockfile, which no upstream commit consumed. The evidence editions this order minted remain the selected ones.

## Earlier findings

- **VER-001 F1** (minor, follow-up: a malformed `linkHosts` value loads and the first automation item then refuses the whole observation with a message that names neither key nor value): stays boarded as [D010](../../evidence/WO-073/decisions.md#wo-073-d010) and FUP-815e8662408881f1. It is in a declared surface and breaks no criterion; the verdict passed, so no repair runs, and a reviewer writes no behavioral fix. By source, `validateStringSet` admits any non-empty string without control characters and the screen's allowlist throws on anything that is not a lowercase multi-label host name; the decision's rule and regression set are the repair's contract.
- **VER-001 F2** (minor, follow-up, outside the surfaces: the closed WO-111 seed generator writes a registration without a `classes` section): stays boarded as [D011](../../evidence/WO-073/decisions.md#wo-073-d011) and FUP-785f679912b2f36c. My search of every tracked and untracked file naming `repositoryClass` outside intake, `node_modules`, `dist` and the register found exactly one writer without a `classes` declaration, that seed; the five fixtures step 2 lists all declare one. Nothing in the gate runs the seed.
- **Adversary F1 and improver R1** (3 found; 2 fixed; 1 recorded): the fixed claims are encoded in the passing suites: extra hosts reach only automation comment bodies, with thread paths, inline paths and check names on the original screen (`check ? [] : linkHosts` in the observer and the criterion-4 fixture's refused metadata items), and the missing-evidence diagnostic names the WorkOrder or the floor separately. The recorded item is the grant-boundary reading in [D008](../../evidence/WO-073/decisions.md#wo-073-d008), which the positive exact-grant case in the fixture establishes; it is a decision, not a deferred defect.

## Criterion judgments

**Criterion 1:** met

- `WO-073 criterion 1: two repositories in one class` passed fresh under `node scripts/harness.mjs bounded` at the integrated identity, with the WO-071 registered-profile test beside it: both members carry the class check, the equipped support's own check and their repository check; the unequipped catalog support stays unequipped; the base support and every base check survive; `registeredProfileMismatches` is empty for the compiled program and names `CLASS LAYER: shared` for a removed check or support; an undeclared check or support refuses naming the launchpad; a widening class support refuses `CLASS LAYER: shared: AUTHORITY WIDENING`; a repository widening without its grant refuses; application is idempotent; the exact-grant member still compiles its grant with the class check present.
- By source, `applyRepositoryClass` unions the class checks into the active mechanic's `requiredEvidence`, links each missing support into the one participating group (raising the container's socket budget by the links it adds), and filters `authorityDiagnostics` for widening on the class's supports; `applyRegisteredRepositoryProfile` now unions the profile's evidence into the WorkOrder as well as the envelope, which is criterion 1's "adds a check". The removal case is read as step 3 and the 2026-10-07 pass decided: a class naming a check the launchpad does not declare refuses, naming the class. The verifier's ten layering probes are carried at the same bytes.

**Criterion 2:** met

- Measured here with `node scripts/harness-context.mjs --check` at the integrated tree: the executor's cold start is 28,112 bytes in both `.claude/skills` and `.agents/skills`, from 27,882, against its 29,246 ceiling (`within`); verifier 25,380, reviewer 26,884, release-close 16,532, planner 18,184 and refuter 17,463 are unchanged. The executor skill grows from 21,009 to 21,239 bytes, the 229-byte sentence plus its newline; `CLAUDE.md` is 6,873 bytes; the other five role skills are byte-identical to `HEAD` in both roots. The sentence adds no `Read:` directive, and `docs/control/budgets.json` is unchanged, so no ceiling route and no acceptance were needed.

**Criterion 3:** met

- The configuration-root suite's `WO-073 criterion 3` subtest passed fresh under the bounded runner: a copy of the subject's `resume.mjs` in a temporary launchpad refuses activation for a missing, directory, leaf-symlink, escaping or unreadable declared profile, naming the path, writes no order log, activates a readable one with no advisory, and activates an undeclared one with exactly one `Advisory: repository target declares no profile`. By source, the check sits after the unknown-id refusal and before the dependency read: `containedRegularFile` then a read, with any failure mapped to one message that names the declared path and judges no content. The verifier's symlinked-component and FIFO probes are carried.

**Criterion 4:** met

- `WO-073 criterion 4` passed fresh with every WO-065 observer fixture (13 observer tests in the run): a declared machine login (declared `Review-Machine`, author `review-machine`, type `User`) is `automated-review` and an undeclared user is `human-review`; a bot body linking the declared host is stored and one linking an undeclared host is refused without text; a declared host does not widen a human body, an inline path or a check name; with neither key the same author is human and the declared-host body is refused as before. The loader subtest refuses `automationLogin`, a typo, as an unknown key. By source, logins are lowercased on both sides, the hosts are added only for the automation role and never for check items, and nothing downstream of classification changed.

**Criterion 5:** met

- Product 03 §Agent enablement skills gains one paragraph in place (the on-demand profile read, out of cold-start context, the launchpad → class → repository order); product 07 §Where the control plane finds its documents adds `classes` to the section list and `repositoryProfiles` to the root list, replaces "an opaque `repositoryClass`" with a reference to `classes`, and adds the class semantics, the profile, `automationLogins`, `linkHosts` and the observer's `--request` flag in place; no added line carries a date. `node scripts/docs-check.mjs` measures product 03 at 179,889 of 194,488 and product 07 at 183,621 of 196,693 bytes. [`docs/repositories/README.md`](../../repositories/README.md) states the convention, the sections and the `dotln-discovery` place. [D003](../../evidence/WO-073/decisions.md#wo-073-d003) records WO-119-D001 revisited with its contract retained and WO-071-D001 not reopened. `npm run publication:check` reports 254 of 254 headings and both outlines CURRENT at the integrated tree.

**Criterion 6:** met

- Re-mints: `docs/evidence/WO-073/authority/001` (`authority.json`, `bundle-diff.json`), the `WO-073/feedback` carry of WO-188/feedback-001 (`edition.json`, `feedback.json`), and `docs/evidence/current.json` selecting both; a carry records `revision: null`, the shape earlier carries recorded. `node scripts/harness.mjs check` reports 34 generated surfaces at the regenerated bundle. The lockfile changes only the skeleton version and pin, so no dependency is added. The regenerated bundle is committed by this review's commit series.
- `npm run test:docs` passes 32 of 32 suites in 131.52 s at the integrated tree (32 fresh tasks; the four current-edition checks among them), recorded 2026-10-09T20:37:38.959Z. `npm test -- --review` at code identity `acc59de0…` composes a passing row from the executor's 88 reused tasks plus the always-fresh format preflight: 37 suites, 0 failed, 8.12 s, exit 0, recorded 2026-10-09T20:37:59.193Z as `host-gate:acc59de0…:npm test`; the executor's fresh run at this identity was 89 tasks in 1,534.475 s. `git diff --check` is clean.

## Findings

<!-- dotln-findings:start -->
[]
<!-- dotln-findings:end -->

Not findings, each checked:

- **A contained profile outside the `repositoryProfiles` root activates.** The registration's `profile` resolves against the launchpad root, and the root is the convention's default home; product 07 and the README say so, and the verifier's probe recorded it. The root is a document root key, not a containment boundary.
- **`readTargetPublishRequest` now loads the launchpad configuration on every read** (VER-001's observation). The registration is the reviewed host input the order chose over request keys ([D004](../../evidence/WO-073/decisions.md#wo-073-d004)); every caller runs inside a launchpad, and the full suite covers the default argument.
- **The feedback edition is selected with `revision: null`.** That is how a carry has been recorded since the first one; the current-edition checks pass in the document gate.
- **`docs-check` prints newer local release tags not in the roadmap.** Pre-existing; the release list is release close's duty, not this order's.

## Implementation review

- **Correctness.** The loader validates the class section before the registrations, so a `repositoryClass` naming no class refuses by path; the class application precedes the profile, so a profile's evidence unions onto class evidence and its narrowing applies to class supports; the mismatch reader names class departures beside profile departures, and both resident callers and the vertical runtime pass `classes`. Activation reads the profile bytes once and judges nothing in them.
- **Authority.** Layers only union checks and links; the only widening path is the existing exact registered-repository grant, and the class's own supports are judged by `authorityDiagnostics` before the profile is applied, so a class cannot smuggle an allow past the floor. A declared login or host changes classification and storage only; triage and verification are untouched.
- **Operator flow.** An activation refusal names the declared path; an undeclared profile prints one advisory. The one gap, a malformed `linkHosts` value stopping an observation with a generic message, is D010's boarded follow-up.
- **Maintainer in six months.** `applyRepositoryClass` carries one comment on the single-group constraint; D002, D003, D004 and D008 explain the section, the root, the request carriage and the grant boundary. One legibility note, not a defect: inside `applyRepositoryClass` the support loop rebinds `id`, the name the enclosing scope uses for the class id; the refusal closure reads the outer binding, so every message names the class, but the next reader will pause on it. It stays as it is because a rename changes the code identity for no behavioral gain.
- **Clean-room screen.** The profile README, the product paragraphs and the fixtures name only generic hosts, logins and repositories; nothing describes a specific managed host, forge account or internal service.

## Follow-up register

`npm run plan -- followups --touching` lists 32 pending rows by textual match at the integrated tree. This review disposes none, because no listed row's seam was opened and no condition occurred:

- Two are this order's own boards, untriaged for planning: FUP-815e8662408881f1 (D010) and FUP-785f679912b2f36c (D011).
- FUP-f1c7a256bec46737 (WO-054-D006, cold-start ceilings) matches product 07; the executor's measure stays within its ceiling, so the row's condition did not occur. FUP-0a7c93eed06727ce (WO-187-D013, optimize product 07) matches the document this order grows to 183,621 of 196,693 bytes; the ceiling the 2026-10-02 pass set covers the write-back.
- FUP-adf6621e7f958dd8 (ER4-006, retained evidence links its inputs) names this order's `authority/001/authority.json`; the re-mint is the edition the Cost line owes, and the row's declined route stands.
- FUP-a5c6ac8cb40bd52a (WO-185-D016, validate `publish --target` arguments before resolving the main-branch worktree) matches `scripts/worktree.mjs`; the new `observe-pr --request` flag validates its store and repository against the request before observing, a different path, and does not open that seam.
- FUP-fd05316b6030ef73 (WO-168-D009) matches `docs/repositories/README.md` by basename only.
- The remaining twenty-five match `scripts/resume.mjs`, `scripts/test-runner.mjs`, `scripts/test-process-debt.mjs`, `scripts/lib/vertical-primitives.mjs`, `packages/skeleton/src/loadouts/contributor.ts`, product 03, the root README or generated projections, and this change opens none of their seams.

`npm run meta` reports the standing reopen candidate WO-150-D003 (`coldStartBytes.executor` above 24,576), which earlier reviews also recorded; the executor measured 27,882 before this order's sentence.

## Release surfaces

- [`PR.md`](PR.md) is written under product 08 §PRs and commits, with one physical line per prose paragraph and the regenerated process meter kept below the prose.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md) is the five-section minor edition for v0.73.0.

The proposed PR title is `:sparkles: Registered repositories share a class's checks and supports, read a profile on demand, and recognize their declared review bots`. Its gitmoji is `:sparkles:`, because the change introduces three registration capabilities a launchpad can use today. The title leads with what a registered repository gets; the loader change, the migration and the observer plumbing belong to the body. The last five merged titles run 20, 18, 19, 17 and 17 words; this title's 17 words come from its three clauses, not from the previous title.

## Executed checks

Each probe ran alone under `node scripts/harness.mjs bounded`; each check ran alone. Times are 2026-10-09 UTC.

| Check | Window | Exit | Result |
| --- | --- | --- | --- |
| `node scripts/harness.mjs usage <session>` (entry) | 20:22:09 | 0 | 143,950 tokens, dispatch scope |
| tree-wide search for `repositoryClass` writers | 20:26 | 0 | 33 files name it; one writer lacks `classes`: `docs/evidence/WO-111/seed.mjs` (D011) |
| `npm run backup:intake`; `npm run worktree -- integrate WO-073 --intake-backup <archive>` | 20:27:31–20:27:45 | 0 | archive of 3 placeholders; checkpoint 6; stash `91967b9d…`; bases equal; no conflict; nine projections regenerated |
| `gateCodeIdentity` before and after integration | 20:27 | 0 | `acc59de0…` both times |
| `node scripts/harness.mjs check` | 20:28 | 0 | 34 generated surfaces |
| `npm run publication:check` | 20:28 | 0 | 254/254 headings; both outlines CURRENT |
| `npm run release -- check-surfaces --local` | 20:28 | 0 | every license, publish-refusal and surface row passes |
| `node scripts/harness-context.mjs --check` | 20:28 | 0 | executor 28,112 of 29,246 in both roots; five roles unchanged |
| `node scripts/docs-check.mjs`; `node scripts/comment-labels.mjs`; `npm run work-orders -- index --check`; `git diff --check` | 20:28 | 0 each | product 03 at 179,889 of 194,488, product 07 at 183,621 of 196,693; 541 files, 0 failures; both index pages current; clean |
| `node --test` over the authority-grants, configuration-root, target-publish and process-debt suites, patterns `WO-073`, `configuration root`, `WO-071`, `WO-065`, `WO-145 optional economy` (bounded) | 20:28:29–20:28:41 | 0 | 31 passed, 0 failed, 12.20 s |
| `npm run meta` after D012 | 20:35:02 | 0 | D012 indexed; one standing reopen candidate (WO-150-D003) |
| `npm run format`; `npm run test:docs` | 20:35:06–20:37:39 | 0 | identity unchanged; 32 passed, 0 failed, 131.52 s, 32 fresh tasks, recorded 20:37:38.959Z |
| `npm test -- --review` | 20:37:49–20:37:59 | 0 | composed at `acc59de0…`: 37 passed, 0 failed; 88 tasks reused from the executor's passing row and 1 fresh (the always-fresh format preflight); 8.12 s; recorded 20:37:59.193Z |

After the gate figures were filled into this report, the PR body and the release notes, `npm run format` and `git diff --check` ran again; the result transition runs `npm run test:docs` and `git diff --check` inline on the final bytes.

Repository writes:

- this report, `PR.md` and `RELEASE-NOTES.md`;
- D012's completion;
- the regenerated runtime, harness bundle, control, release-preparation, decisions-index, follow-up-register, meta, work-order-index, history and publication-lock projections.

No behavioral source was edited. The intake backup lives in the session scratch; the suites' own cleanup removed their temporary launchpads.

Goal alignment outcome: matched. The integrated bytes are the judged bytes, each criterion was re-run or re-measured here, the two boards stayed boards, the review row was reused rather than repeated, and the reviewed state is ready to commit.
