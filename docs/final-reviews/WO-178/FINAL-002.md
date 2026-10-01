# WO-178 — FINAL-002

**Verdict:** pass. All eight criteria are met on the integrated tree. FINAL-001 failed criterion 6 because the operator-word check never read a provenance field inside a header paragraph (D015). The repair reads every field (D017, D018), and VER-002 confirmed the fix by injection across all 168 provenance fields. I integrated `main` at `54c29c12`, past WO-103, WO-102, WO-181 and WO-105. Main changed none of this order's source or test files, so each criterion's evidence carries forward on unchanged bytes. The product gate passed fresh on the merged tree: `npm test -- --review` ran 43 suites, 0 failed, in 810.53 s at code identity `9ee66ec2…`. Integration needed three bookkeeping steps (D022):
- **Component labels.** The patch bumps move to compiler 0.22.1 and skeleton 0.49.1, above main's 0.22.0 and 0.49.0.
- **Evidence editions.** Three editions are re-minted deterministically, and the feedback edition carries WO-181's live audit.
- **Release.** The release retimes to `v0.61.2`.

One defect outside the criteria is boarded: [D023](../../evidence/WO-178/decisions.md#wo-178-d023--final-review-widens-d012-every-retry-release-close-records-prints-bare-node) widens D012. Every retry that release close records prints bare `node`, not only the material retry, so none of them matches the admission. That is fail-safe: an unmatched command keeps the host's previous judgment.

**Subject:** [`docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md`](../../work-orders/WO-178-the-record-holds-what-the-operator-sees.md) on branch `wo-178`, uncommitted and staged.
- **Bases.** The original base is `2f52501450b55abdb03386352bb651909bb2e134`. The integrated base is `main` at `54c29c1294b07c1cbece31f49f31f9fefdc53c73`.
- **Checkpoints.** The dispatch checkpoint is `refs/dotln/checkpoint/WO-178/11`. The integration checkpoint is `/12`, and the named stash `c34b6b48…` is retained.
- **Code identity.** The merged tree's code identity is `9ee66ec2faa53e1f53b0706e5f00582a0126ffac81e62ffce75214b909252afd`. VER-002 judged `7706376b…` on the original base.
- **Verification sequence:**
  - [VER-001](../../verifications/WO-178/VER-001.md) passed;
  - [FINAL-001](FINAL-001.md) failed criterion 6 (D015);
  - the Codex repair addressed it (D017–D020);
  - [VER-002](../../verifications/WO-178/VER-002.md) passed.

  Each filed report hashes to its control-log `reportHash`.
- **Order text.** It differs from the base only in its heading's version label, now `v0.61.2`. I judged the original eight criteria.
- **Ideation.** No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.287","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 39180 tokens; handoff 30759510 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness. The canonical phase selected WO-178 and allocated this path. The operator made no choice about the verdict. The actor values are this session's: Claude Code 2.1.287 from `claude --version`, model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Fan-out plan, stated before any spawn: no subagents out of the 20 available. The usage readback observed 0 admissions with 20 remaining, and the root session was the only writer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage 96537b66-925f-4c93-9561-6c46d7722b92`, scope `dispatch`.
- **Entry:** observed at 2026-10-01T18:40:52.478Z.
- **Handoff:** observed at 19:11:26.978Z, after D022, D023, `npm run meta` and the register batch, and before this report, `test:docs` and the result transition. It covers 159 steps and 142 commands.
- **Breakdown:** 30,401,926 cached input, 278,554 cache-write, 304 uncached input and 78,726 output tokens. Both totals are cumulative transcript counters and do not measure live context.
- **Unavailable:** reasoning tokens and dollar cost, which means unknown, not zero.

The largest wall-clock cost was the one fresh product gate on the merged tree (810.53 s). It ran because the merged code identity was new, so no covering row existed.

## Goal-aligned judgment

WO-178 is machinery, and its mission contribution has two parts. A planning pass opens on a record of what the operator saw. The one lifecycle-authorized publish runs under Claude auto mode without a classifier verdict. The traps shaped this review as follows:
- **Rule beating.** I re-read the admission against every printer of a close command, not only the one the fixture builds by hand. That surfaced D023.
- **Seeking the wrong goal.** I did not take "0 advisories" as coverage. VER-002's injection measured coverage, and I re-ran the check over the merged corpus, including upstream's new orders and decisions.
- **Drift.** I carried no criterion forward without naming the bytes it rests on. Main touched none of this order's source or test files, and the merged tree passed its own gate.
- **Escalation and policy resistance.** The admission still runs after the gate, planning-branch, subagent and read-scope judgments, and the outside-write wrapper still prefers a deny. The only allow is the exact helper.
- **Tragedy of the commons.** I ran one product gate, where the merged identity required it, and no subagents.
- **Success to the successful.** I did not keep either side's evidence selection by default. Each was checked on the merged tree, and neither held.
- **Shifting the burden.** D023 widens D012's route instead of opening a second owner, so the next executor fixes every printer at once.
- **Naive Interventionism.** I wrote no behavioral code. The integration changed version labels, regenerated projections and minted deterministic evidence, following the WO-147-D010 precedent.
- **NoOp.** Publishing without integrating would ship labels below main's and editions that fail on the merged tree.

## Integration

`npm run worktree -- integrate WO-178` fast-forwarded the uncommitted branch to `main` and re-applied the work from the named stash. Seven authored conflicts were reported, and I resolved them explicitly (D022):
- **Version files.** These were `packages/compiler/package.json`, `packages/compiler/src/artifact-identity.ts`, `packages/skeleton/package.json`, `packages/console/package.json` and `package-lock.json`. Main's side was kept, and this order's patch bump was applied above it: compiler 0.22.1, skeleton 0.49.1, with the console pins, the skeleton's compiler pin and the lockfile following. The harness host stays at 0.34.1, because main kept 0.34.0.
- **`docs/evidence/current.json` and `packages/console/fixtures/manifest.json`.** Main's WO-181 selection was taken first. Its four edition checks then all failed on the merged tree: authority and verification with assertion diffs, artifact identity with four stale files, and feedback with a moved policy hash. I selected new WO-178 revisions and minted them:
  - authority 004;
  - artifact identity 002;
  - verification 002;
  - feedback-002, by `--carry docs/evidence/WO-181/feedback-002`.

  The carry is the route the feedback check prints, and it refuses when judged behavior changed. Each `--check` passes. `console-fixtures --record-current-selfhost` re-pinned the self-hosted case, and `--check` matches all five cases.

`--continue` regenerated the runtime, the harness bundle and manifest, the control projection, the index, meta and the publication locks. It retimed the release from `v0.61.1` to `v0.61.2` under the patch classification, because WO-105 published `v0.61.1`. It also wrote the draft D022, which I completed with the carried-forward claims.

The overlap between main and this order is limited:
- **Product 07.** Both edited it, in different paragraphs, with no conflict. The planning sentence is intact at 216 bytes.
- **Generated surfaces.** The version files and generated surfaces were resolved as above.
- **Not touched by main.** `harness-host.ts`, `harness-command.ts`, the compiler's `harness.ts`, `plan-failures.mjs`, `refute-plan.mjs`, `docs-check.mjs`, `meta.mjs`, `resume.mjs`, `work-orders.mjs` and the four test files. `docs/AI-HARNESS-SECURITY.md` is also unchanged upstream.

## Criterion judgments

**Criterion 1:** met.
- **Carried forward.** VER-001 ran the `PermissionDenied` fixture fresh: tool, digest, byte count, bracketed rule, order, role and phase, one advisory naming the `!` prefix and `/permissions` Recently denied, and no `retry`. VER-002 ran it fresh again at the repaired identity. The handler and its emitter are unchanged by the integration.
- **Merged tree.** `node scripts/harness.mjs check` reports 32 generated surfaces. The regenerated `.claude/settings.json` registers `PermissionDenied` with matcher `.*` running `.claude/hooks/permission-denied.mjs`. The harness fixture suites passed in this review's gate.
- **Limit.** No live denial has occurred.

**Criterion 2:** met.
- **Carried forward.** VER-001 and VER-002 ran the prompt fixture fresh. A prefixed message records its class and route, an unprefixed one records `unclassified`, and no row holds message text. The fixture asserts both the digest and the absence of the text.
- **Merged tree.** The source is unchanged by main, and the fixture passed in this review's gate.
- **Boarded.** D014 stands.

**Criterion 3:** met. VER-001 and VER-002 ran the Stop fixture fresh: with one journaled running dispatch the advisory names it, and with none the advisory is unchanged. The source is unchanged by main, and the fixture passed in this review's gate.

**Criterion 4:** met.
- **Carried forward.** VER-001 and VER-002 ran the admission fixture fresh. The exact helper with the lifecycle facts returns `allow`, with the facts in its reason. Each enumerated negative returns no `allow`: no recorded dispatch, a worktree, legal actions lacking `release-close`, another order, a trailing argument and a widened path.
- **Source re-read.** I re-read `releaseCloseAdmission` and its placement on the merged tree. It runs after the gate-write, planning-branch, subagent and read-scope judgments. The outside-write wrapper keeps a deny over the allow. The recorded dispatch is cleared when the role changes away from release close.
- **Existing refusals.** Every existing refusal fixture passed in this review's gate.
- **Boarded.** D012, widened by D023, and D013 stand.

**Criterion 5:** met.
- **Carried forward.** VER-001 ran the fixtures fresh: one close record with a blocker, one denial row, three intervention rows, one phase attempt above twice its median, and two gate rows at one identity. They yield the five labelled counts, the `plan start` block with `unknown` tracks, and the export's observations. VER-002 ran them fresh again.
- **Merged tree.** The sources are unchanged by main, and the plan-refutation and work-order suites passed in this review's gate. `node scripts/refute-plan.mjs failures` on the merged record prints all five counts with `source: local`:
  - `localReleaseCloses` 0 (0 records);
  - `localHostDenials` 0 across 6 journals;
  - `interventions` 12: 5 direction and 7 `unclassified`;
  - `longPhases` 4 (WO-102, WO-174, WO-175, WO-176);
  - `repeatedGateRuns` 1, VER-001's `--again` rerun.

  It also prints `recentTracks` with 8 counted, all `unknown`.

**Criterion 6:** met.
- **Carried forward.** VER-002 established the repair:
  - injection after every line-start provenance label reported 165 of 168 fields, and the three silent ones cite a same-field digest;
  - both new fixtures fail against checkpoint 5's reader;
  - the 61 candidates reconcile with the manifest, 27 paraphrased and 34 retained;
  - every paraphrase keeps its recorded meaning.
- **Merged corpus.** `node scripts/docs-check.mjs` prints `Operator-word advisories: 0; historical baseline: 34.` and PASS. Main's new orders and decisions add no advisory. The docs-check suite passed in this review's gate.
- **Paraphrase count.** D018 and `operator-word-repair.json` record 30 paraphrases across the order, the bound, and 34 fingerprinted exceptions.
- **Boarded.** D021 stands.

**Criterion 7:** met for what is due before close.
- **Write-backs.** The `docs/AI-HARNESS-SECURITY.md` auto-mode row is 422 bytes, unchanged upstream. The product 07 planning sentence is 216 bytes, intact beside main's bootstrap edit in another paragraph. `npm run publication:check` passes on the merged tree.
- **Decisions.** `decisions.md` holds D001–D023. D022 is the completed integration record, and D023 is this review's widening. `npm run meta` refreshed the index.
- **Register.** The rows the provenance names hold their WO-178 dispositions. This review settles the three rows allocated to WO-178 and D015's row (Register below).

**Criterion 8:** met.
- **Product gate.** `npm test -- --review` passed fresh on the merged tree: 43 suites, 0 failed, 88 fresh tasks, 810.53 s, exit 0, recorded 2026-10-01T19:04:07.060Z at code identity `9ee66ec2…`. Its selection is VER-001's 43 suites. `evidence-sources` is not selected: against `main`, its only changed declared source is the compiler's release literal, which the runner's `changedMachinery` excludes by design.
- **Document gate.** `npm run test:docs` passed 24 of 24 tasks in 36.89 s with this report, the PR body and the release notes in place. The completion transition reruns it.
- **Diff.** `git diff --cached --check` is clean.
- **Dependencies.** None is new. The package and lockfile changes are internal version labels: compiler 0.22.1, skeleton 0.49.1 and harness host 0.34.1.
- **Suppressions.** No added line carries a lint, type, format or shellcheck suppression.

## Findings

[D023](../../evidence/WO-178/decisions.md#wo-178-d023--final-review-widens-d012-every-retry-release-close-records-prints-bare-node) boards a widening of D012 and reopens it.
- **What it found.** `scripts/release.mjs` builds the retry command of a finish, settle, cleanup, publication or completion blocker from the bare word `node` (lines 1647, 1706, 1751 and 2545). `materialCloseCommand` does the same for the material retry. Only `worktree publish` prints the quoted `process.execPath` helper that `releaseCloseAdmission` matches (`scripts/worktree.mjs` line 601).
- **A correction to VER-001.** Its criterion 4 states that release close and `worktree.mjs` print the admitted bytes. Only `worktree.mjs` does.
- **Why it is not a fail.** Criterion 4 names the publish helper text and its negatives, and both hold. A retry that is not admitted keeps today's host judgment.
- **The route.** It is D012's (`FUP-00ed3cd9ab11599f`), with the wider rule: every close command printed by release close or `worktree publish` comes from one shared spelling that the admission matches, and a fixture admits each printer's own output.

I concur with the earlier boards. Each is outside its criterion's enumerated behavior and names its repair rule:
- [D012](../../evidence/WO-178/decisions.md#wo-178-d012--verification-boards-the-unadmitted-material-retry-spelling), widened by D023;
- [D013](../../evidence/WO-178/decisions.md#wo-178-d013--verification-boards-the-admissions-precedence-over-a-typed-correction), the admission's precedence over a typed correction, which is latent while no DotLn loadout sets a correction token;
- [D014](../../evidence/WO-178/decisions.md#wo-178-d014--verification-boards-host-notifications-counted-as-operator-messages), host notifications counted as operator messages (medium). This session adds a live instance: journal row 1319 (`unclassified`, 418 bytes, digest `9d892fdc…`) matches by digest the transcript's `queued_command` whose `commandMode` is `task-notification`, the gate's completion notice. I typed nothing at that time. The probe printed only hashes and byte counts, and no text was copied;
- [D021](../../evidence/WO-178/decisions.md#wo-178-d021--verification-boards-provenance-records-that-share-one-baseline-key), two provenance records sharing one baseline key, which is latent in the current corpus.

## Register

`npm run plan -- followups --touching` matched 40 pending rows at register revision `b944cf77…`. Before the listing, `npm run meta` had indexed D023 and added its reopening to D012's row as a new source revision. One `npm run plan -- followups --apply` batch against that revision produced `c614f5b9…`.

| Rows | Matched | Disposition | Reason |
| --- | --- | --- | --- |
| FUP-84ea5fb168c317cf, FUP-0c76cd39223a576b, FUP-ecf9d3b703a0b7d9 | allocated to WO-178, so not in the pending listing | settled | The provenance-named deliverables are verified and pass here, as WO-175's review settled its rows. The first live close stays the declared observation, and the retry spelling stays with D012. |
| FUP-de7e15d4444da75b | allocated to WO-178 for D015 | settled | VER-002 verified the repair, and this review passes it. |
| FUP-fb8cbeabbddef397 (ER4-005) | `docs-check.mjs`, `refute-plan.mjs`, product 07 | kept open, observation added | The new operator-word scan reads every order and decision on each run: 1.14–1.21 s of a 10.45–10.55 s `docs-check` on the operator's host. |
| FUP-00ed3cd9ab11599f (D012) | `harness-host.ts`, `test-harness.mjs` | left untriaged, new source revision | D023 widens its rule; planning routes it. |
| FUP-d5a399224b1a5886, FUP-bfe39a18fdf822ae, FUP-f927210831623001, FUP-2f1b441dc2c37776 | this order's D013, D014, D021 and D006 | left untriaged | Planning routes them. D014 gains this session's live instance (Findings). |
| FUP-3682b768d1d00a3b, FUP-dbced48c3d572461, FUP-f55fb29d73e6f813, FUP-71fc2efc208f597a, FUP-7fd69f3bda6fa326, FUP-8cfd3ff52146a016 | WO-178 and its paths | left | Their recorded WO-178 dispositions stand, and none of their conditions occurred in this review. |
| FUP-5cc91ab6105d2eeb | WO-178, `repair.md` | left untriaged | WO-178 counts repeated gate rows. Its non-goals leave explaining them to WO-174's route. |
| The other 27 | product 07, harness sources, scripts, generated and evidence files | left | Textual matches. No seam opened and no condition occurred. |

## Executed checks

| Check | Result |
| --- | --- |
| `node scripts/harness.mjs usage` (entry, handoff) | 39,180 and 30,759,510 tokens; source `claude-transcript-message-usage`; 0 subagents |
| `npm run resume -- status --json` | WO-178 `final-review`; legal action `final-review-result` |
| Report hashes | VER-001, FINAL-001 and VER-002 match their control-log `reportHash` |
| `npm run worktree -- integrate WO-178`, then `--continue` | bases `2f525014` → `54c29c12`; checkpoint `/12`; stash `c34b6b48…`; seven authored conflicts resolved; release retimed to `v0.61.2`; draft D022 |
| Edition checks against main's WO-181 selection | all four fail on the merged tree |
| `authority-evidence`, `artifact-identity-evidence` and `verification-evidence`, each `--write` then `--check` | WO-178 authority 004, artifact identity 002 and verification 002 verified |
| `feedback-evidence --carry docs/evidence/WO-181/feedback-002`, then `--check` | WO-178 feedback-002 verified: ten passing regressions, ten removal failures |
| `console-fixtures --record-current-selfhost`, then `--check` | five cases match |
| `node scripts/harness.mjs check` | 32 generated surfaces |
| `npm run publication:check` | PASS |
| `npm run release -- check-surfaces --local` | 57 PASS, exit 0 |
| `node scripts/docs-check.mjs` | PASS; operator-word advisories 0, historical baseline 34, before and after D023 |
| `node scripts/refute-plan.mjs check` | exit 0 |
| `node scripts/refute-plan.mjs failures` | the five counts and the track split under Criterion 5 |
| `npm test -- --review` (merged tree, staged) | 43 passed, 0 failed, 810.53 s, 88 fresh tasks; identity `9ee66ec2…`; recorded 2026-10-01T19:04:07.060Z |
| Operator-word scan timing (scratch probe importing `docs-check.mjs`) | 1.14–1.21 s in-process; whole `docs-check` 10.45–10.55 s |
| D014 digest match (this session's journal against its transcript, by hash) | row 1319 matches the `task-notification` queued command, 418 bytes |
| Clean-room screen of the staged diff against `main` | no user path, private host or secret shape; one public Claude Code documentation host |
| Suppression scan of added lines | none |
| `git diff --cached --check` | clean |
| `npm run meta` | D023 indexed; D012's register row gained a revision for D023; health line `1 reopen candidates` (WO-150-D003) |
| `npm run plan -- followups --apply` | five dispositions; register `c614f5b9…` |
| `npm run test:docs` | 24 passed, 0 failed, 36.89 s, after a first run failed the release-notes body profile on two tag-shaped placeholders, which I rewrote as paths |

## Route

Record the pass, commit the reviewed state in coherent commits and publish the WO-178 branch and its PR. Merging, release close and the tag stay with the operator. The first release close under Claude Code auto mode after this order merges is the live check of the admission: its `release-close.json` and the denial journal show whether the host honored it, and the next planning pass reads them.
