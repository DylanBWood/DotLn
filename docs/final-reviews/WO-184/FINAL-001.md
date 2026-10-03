# WO-184 — FINAL-001

**Verdict:** pass. All twenty-two criteria are met against the original order. The evidence is the complete verification sequence, my own reading of the authored source diff, and this review's repair. VER-002 carried two findings, G1 and G2, to WO-123. Both lay in this order's declared surfaces, so I repaired them here instead ([D039](../../evidence/WO-184/decisions.md#wo-184-d039--final-review-repair-g1-and-g2-in-the-order)):
- G1: the writer's sandbox profile now denies the paths the host's writer Write route protects.
- G2: the review-stream fixture now pins every criterion as stale after a repair.

The repair re-ran criterion 20's regeneration, with a fresh live feedback audit, and a fresh `npm test -- --review`. `main` has not moved, so there was nothing to integrate.

Two corrections are recorded:
- [D040](../../evidence/WO-184/decisions.md#wo-184-d040--hard-error-the-first-final-review-session-looped-on-refusals-and-forced-a-restart): the operator directed that this be recorded as the reviewer agent's hard error. The first session of this review looped on refused responses and forced the operator to restart it.
- [D041](../../evidence/WO-184/decisions.md#wo-184-d041--correction-subagent-review-scope-in-this-final-review): I misread the operator's subagent instruction, and corrected course.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.288","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 85983 tokens; handoff 18378172 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-184 and allocated this path. The actor values are this session's:
- Claude Code 2.1.288, from `claude --version`.
- Model `claude-opus-5-5`.
- Effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Cost scope is this dispatch, read with `node scripts/harness.mjs usage 95eb2295-e73a-4aad-b6b2-4853774c2d87`, scope `dispatch`. The entry sample was observed at 2026-10-03T15:10:33.580Z and the handoff sample at 2026-10-03T15:39:54.299Z (126 steps, 103 commands), before this report was filed; 18,053,121 of the handoff total is cached input. The harness observed exactly 3 subagent admissions, 17 remaining. Both are cumulative transcript counters made up almost entirely of cached input; they do not measure live context. Reasoning tokens and dollar cost were unavailable. The largest wall-clock costs were the product gate (755.95 s) and the live feedback audit (109.47 s).

Fan-out: three read-only subagents, against a `subagentCap` of 20.
- Two whole-order reviewers were started by mistake and stopped after about nine seconds, before either reported (D041).
- One reviewed the repair diff: 94,924 tokens, 34 tool calls, 259.7 s.

This session was the only writer.

## Subject and evidence

The subject is the uncommitted worktree on branch `wo-184` over base `53fc6eb8`, which is `origin/main` and `main`. The numbered verification sequence is complete:
1. [VER-001](../../verifications/WO-184/VER-001.md) failed on criterion 11's byte-identity clause (F1) and raised ten low findings, R1 to R10.
2. A repair followed (D033 to D037).
3. [VER-002](../../verifications/WO-184/VER-002.md) passed all twenty-two criteria. It settled F1 and R1 to R10, and carried G1 and G2 with a follow-up (D038).

No ideation breakout receipt applies, because the evidence folder holds none. The order's text is unchanged since activation, and no scope expansion was recorded.

Integration. `git fetch origin` left `origin/main` at `53fc6eb8`, the branch base, with no commit between them. There is nothing to integrate, and `v0.66.0` stays the target.

I read:
- the order whole;
- VER-001's verdict and VER-002 in full;
- the executor's handoff, D038, and the repair records D033 to D037 where they bear on the carried findings;
- product 07's Discipline section (Adjacent Repair) and product 08 §PRs and commits;
- the authored source diff against `53fc6eb8`:
  - `story-contract.ts` and the compiler version constant;
  - `pull-request-observer.mjs`, `target-publish.mjs`, `github-body.mjs`, `review-comment-loop.mjs`, `config.mjs`, `entropy-review.mjs` and `scripts/worktree.mjs`;
  - in the skeleton, `cli-episode.ts`, `entropy-review-protocol.ts`, `repair.ts`, `resident-state.ts`, `verification-protocol.ts`, `worker-protocol.ts`, `worker-transport.ts`, `source-change-command.ts`, `discovery-sandbox.ts`, and the wrappers of `verification-fold.ts` around its three moved bodies.

The moved bodies themselves rest on VER-002's byte check against `git show HEAD` and on `check-reactor-move.mjs --check`. I did not read the evidence JSON, fixtures or tests line by line beyond the files this review changed. For those I rely on VER-002's judgments and their recorded runs.

The diff matches the order's design for each item:
- **Compiler.** A derivation with no surface goes to `NeedsHuman` at any threshold. Only rule coverage counts, and an inference-only requirement becomes a candidate with its inferred surfaces. The hyphen is a noun boundary. A whitespace-only image span derives nothing. Duplicate relations are dropped before the identifier is computed. `follows` targets the first later entry by another author.
- **Scripts.**
  - Every cursor and thread identifier the observer sends back is a bounded token, and any error the observer did not raise prints a fixed reason. A screen overflow refuses only its item.
  - A flagged repeat re-evaluates readiness before returning the recorded publication.
  - `not-applicable` with a reason is admitted for build and lint only.
  - The loop checks item terminals before reporting `resolved`. It measures freshness from the item's latest push or disposition, sends a line-less automated comment to the human, and returns `human` where derivation failed.
  - The config reader opens non-blocking and refuses a non-regular file.
- **Skeleton.**
  - The verification-fold wrappers apply the notice and the review-stream staleness.
  - The repair payload is typed.
  - The schema's claim-type enum follows the capsule.
  - The writer's profile is a host-owned file, read-only, outside the worktree, compared byte for byte on every use, and its absence or drift refuses.
  - `TMPDIR` reaches the worker through its launch environment.
  - The supervisor kills its episode on SIGINT, SIGTERM and SIGHUP.
  - An answered `unknown` over an incomplete capsule names what was omitted.

I found no defect outside G1 and G2.

Clean-room screen: I searched this review's own additions for user paths, account identities, URLs, token and key shapes, and private keys. D040 cited the local transcript under a home-directory path, so I replaced it with the session identifier alone. No other match. No lint or type suppression directive was added.

## The repair (D039)

The rule is product 07 §Discipline, Adjacent Repair: "A repairable defect in the order's declared surfaces stays in the order." Pre-existing origin and omission from the assignment are not by themselves reasons to defer. D038 carried G1 because it contradicts no clause of criterion 15 and predates the order, and neither ground holds under that rule. Both findings sit in declared surfaces: `discovery-sandbox.ts` is item 15's file, and `fixture.mjs` is item 12's fixture.

**G1.** `writerSandboxProfile` now also denies writes under `<root>/.git`, and to `<root>/claude.local.md` and `<root>/CLAUDE.local.md`. The host's writer Write route protects `.git`, `claude.local.md`, `.dotln` and five paths under `.claude` (`harness-host.ts:5108-5117`). The profile now denies all of them, `.claude` and `.dotln` as whole subtrees.

The criterion 15 native fixture now also shows several refusals:
- The confined command cannot write, chmod or rename over the linked worktree's `.git` link file, and the link's bytes are unchanged.
- It cannot create either spelling of the local instruction file (`EPERM`), and neither exists afterwards.
- A product write still succeeds.

Control: under the pre-repair profile string, writes to `<tree>/.git` and `<tree>/claude.local.md` succeed. Under the repaired one, both are denied.

**G2.** The criteria 12/13 fixture asserts that the review-stream staleness entry's `criterionIds` equals every criterion id, beside `changedSurfaces` `["sum.mjs"]`. Deleting the fold's all-criteria line from the built output makes the test fail at `fixture.mjs:670`. The build was then restored.

**Independent review of the repair.** One read-only subagent reviewed `git diff refs/dotln/checkpoint/WO-184/9` over the three files and returned "ship" with no blocking finding. It ran its own native probe: absent and present spellings were refused, `.git` was refused both as a directory and as a link file, and product files were written. It confirmed:
- rule order and quoting;
- that both drift checks in `source-change-command.ts` (`:83`, `:183`) fail closed on a profile written by an earlier build;
- that no test or evidence file pins the profile bytes.

I applied its two cheap nits:
- the canonical `CLAUDE.local.md` literal;
- create-when-absent cases that require `EPERM`.

Its third nit asked that the other profile consumers be run. The product gate below covers them in the `skeleton` suite and in the machinery suites its selection names.

**Regeneration (criterion 20).** `discovery-sandbox.ts` is a judged feedback source. [final-regeneration.json](../../evidence/WO-184/final-regeneration.json) records each step:

| Step | Wall time |
| --- | ---: |
| Harness emit | 0.183 s |
| Authority re-mint, revision 003 | 0.672 s |
| Feedback re-mint, revision 003 | 2.596 s |
| Live feedback audit, `codex-cli-exec` `gpt-6.1-sol` at `max` | 109.471 s |
| Record | 0.338 s |
| Console re-pin | 0.397 s |
| **Whole** | **115.606 s** |

After the harness re-emit, only authority and feedback were stale. Artifact identity and verification stay at revision 002 and check current. The whole time sits beside WO-175's 384 s catalog figure, which was not a measured whole, so the comparison establishes no speedup. The criterion 13 live receipts bind eleven runtime sources, and `discovery-sandbox.ts` is not among them, so receipts 006 to 008 still describe the current sources.

## Criteria

Since VER-002's subject (checkpoint 7), only this review's repair changed authored source or tests: `discovery-sandbox.ts`, `source-change-confinement.test.ts` and `fixture.mjs`. The harness re-emit and the console re-pin changed generated output. Criteria 1 to 11, 13, 14 and 16 to 19 therefore rest on unchanged code. Their evidence is VER-002's judgments with its recorded runs, my source reading above, and the fresh product gate.

**Criterion 1:** met. A derivation with no surface returns `NeedsHuman` before the threshold comparison (`story-contract.ts`, the `!surfaces.length` branch). VER-002's run passed `unmapped-at-zero` and the R1 case. The compiler suite is in the fresh gate.

**Criterion 2:** met. Coverage counts only `origin === "rule"`. Uncovered statements gain their inferred surfaces as `unmapped-requirement` candidates. VER-002 reran all 11 retained WO-124 inputs: five changed, and D003 and D004 name them.

**Criterion 3:** met. The noun boundary class is `[\p{L}\p{N}_-]`. The `hyphen-boundary` and `literal-noun` cases pass.

**Criterion 4:** met. An image span whose resolved text trims to empty is skipped. The WO-061 D011 probe P1 bundle compiles (`compiler-fixtures.txt`).

**Criterion 5:** met. Relations are deduplicated by canonical key before sorting and before the identifier; class entries pass through to the existing overlap refusal. The revision comment is corrected.

**Criterion 6:** met. `follows` uses the first later entry by another author. `compiler-compatibility.mjs --check` keeps all 35 WO-060 outcomes, and WO-061 `fixtures.mjs --check` keeps 50,353 bytes (VER-002).

**Criterion 7:** met. `argumentToken` bounds the cursor and the thread identifier, and `observePullRequest` maps any foreign error to a fixed reason. `screen` contains a `RangeError` per item as `unscreenable-text`. The script-seams transcript records the fake-`gh` cases, and the WO-065 README states what is and is not logged.

**Criterion 8:** met. `publishTargetOrder` returns a recorded publication early only without the flag. With it, readiness is evaluated first, and the publication returns afterwards with no remote call. The checks row admits `not-applicable` with a reason for build and lint only, and prints the reason. `test-target-publish.mjs` covers all three behaviours (VER-002 R4).

**Criterion 9:** met. Terminal-first stop, receipt-based freshness, line-less comments and derivation failures behave as described above. The loop fixtures pass in the gate (VER-002 R5).

**Criterion 10:** met. `loadConfig` opens `O_RDONLY | O_NONBLOCK`, checks `fstat` and refuses a non-regular file by path. The FIFO refusal took 42.302 ms (`configuration-fixtures.txt`). The runtime status stays exit 0 with the configuration invalid and work orders unavailable. Both disclaimers are gone.

**Criterion 11:** met. `reactor.ts` is 90,998 characters. VER-002 confirmed:
- the three HEAD bodies are byte-identical substrings of `verification-fold.ts`;
- `reactor-identity.mjs --check` verifies 18 streams with no successor manifest;
- the registrations, purity and import lists hold;
- no `any` remains.

**Criterion 12:** met, and strengthened by G2. The review-stream fixture re-verifies every criterion after a one-surface repair, dispatches the review, and now pins the staleness entry's full criterion set. `review.test.js` passes 13 of 13 ([final-repair-fixtures.txt](../../evidence/WO-184/final-repair-fixtures.txt)).

**Criterion 13:** met. The notice sentence is added only when `verificationReviewNotice` admits it. `check-legacy-notice.mjs --check` replays the no-notice stream byte-identically. Receipts 006 to 008 are three live Claude attempts on the repaired fold. In each, both behaviours pass with no attention request, and both planted defects are reported by the reviewer. Every earlier receipt is kept.

**Criterion 14:** met. The claim-type enumeration is filtered to the capsule's criteria (`["visual","network"]` in `verification-witness.test.js`). The admission check is unchanged.

**Criterion 15:** met. Every clause holds at this subject:
- no asterisk in the allowed entry;
- a one-character drift denied;
- network and outside writes denied natively;
- an asterisk contract command refused with its reason;
- a write to the profile file denied.

G1 is repaired: the confined command can no longer write any path the host's Write route protects, which is shown natively above. `source-change-confinement.test.js` passes 3 of 3.

**Criterion 16:** met. The instruction sentence begins with a non-space character and ends with one space before the next sentence. `TMPDIR` reaches the worker only through its launch environment, and the wrapper that mutated the parent's is removed. The 23 entropy fixtures passed.

**Criterion 17:** met. `cli-episode.ts` kills the active episode and exits on SIGINT, SIGTERM and SIGHUP. The built-entry signal fixture leaves no process in the episode's group (VER-002, agent A).

**Criterion 18:** met. An answered `unknown` over an incomplete capsule names each omitted path and the omitted decisions. One over a complete capsule reads "returned an unknown judgment". The unanswered case keeps its original text.

**Criterion 19:** met. The closure walk has exactly two reasoned exclusions and refuses a third member's host import. The review-failure fixture asserts all four facts for both `failed` and a rejected transport.

**Criterion 20:** met. Every edition the edited sources staled was re-minted deterministically, and the feedback edition was re-minted from one live audit on Codex `gpt-6.1-sol` at `max`. This happened after the last edit to a judged source in the original run (D028), in the repair (D035), and now in this review (D039). The wall times of every step are recorded each time, beside 384 s. All four edition checks, the console check (5 cases) and `harness check` (32 surfaces) pass. `current.json` selects revision 003 for authority and feedback, and 002 for the other two.

**Criterion 21:** met. The write-backs are in place with no dated paragraph:
- product 03 §VerificationAdapter and §DeliveryAdapter;
- product 04;
- `packages/console/README.md`;
- the WO-065 README.

D003 to D020 and D022 name each item's source decision. `close-register.json` names the 19 rows for retargeting at close, and `publication:check` passes.

**Criterion 22:** met. `npm test -- --review` passed at this subject's code identity (see Executed checks). `npm run test:docs` passed with this report in place. `git diff --check` is clean. No dependency was added: the only package changes are the compiler 0.25.0 and skeleton 0.52.0 versions and their pins.

## Register

D038's follow-up created register row `FUP-c4e2db6d99a13eb7`. D039 discharges it, because G1 and G2 are repaired in this order, and it stays untriaged until a planning pass disposes of it. Criterion 21's nineteen rows are retargeted at close, as `close-register.json` lists them. D040's follow-up names a role-text change: judge a security-boundary finding by its recorded rule and repair it defensively, and change approach after a refusal rather than retrying. `npm run meta` boarded it as row `FUP-ebaa803e38670545`, which stays untriaged.

## Executed checks

- Usage and state: `node scripts/harness.mjs usage 95eb2295-…` at entry and handoff; `npm run resume --silent -- status --json`; `node scripts/harness.mjs writer --show`; `git fetch origin` with `origin/main` = HEAD = `53fc6eb8`.
- The previous session's transcript, read for D040: six messages ended with `stop_reason` `refusal` between 15:05:57Z and 15:09:37Z.
- Focused tests, in [final-repair-fixtures.txt](../../evidence/WO-184/final-repair-fixtures.txt): `source-change-confinement.test.js` 3/3; `review.test.js` 13/13.
- Controls:
  - The pre-repair profile string allows writes to `.git` and `claude.local.md`; the repaired one denies both.
  - Built-fold mutation for G2: 12 pass, 1 fail at `fixture.mjs:670`, then rebuilt.
  - Case variants of present and absent protected names are denied on this volume.
- Regeneration: `final-regeneration.json`, every command exit 0. Afterwards each check passed:
  - authority, artifact identity, verification and feedback `--check`, the last reporting "docs/evidence/WO-184/feedback-003 judged the current source";
  - `console-fixtures.mjs --check` (5 cases);
  - `harness.mjs check` (32 surfaces).
- Final product row: `npm test -- --review`, run once after the repair's last source edit and recorded 2026-10-03T15:38:19.616Z: 41 passed, 0 failed, 755.95 s, 86 fresh tasks. Code identity `ad25ae0d242b3f467c98a06bee8cf241460871c3aae4c4ff0f3106d07f54bc63`, tree `be4043c7`. The selection covers `skeleton` (357.99 s), which runs the confinement and review tests and the other writer-profile consumers. It also covers `worktree-integration` (323.45 s), `plan-refutation` (65.13 s) and the rest of the 41.
- `npm run test:docs`: 24 passed, 0 failed, 40.35 s, 24 fresh tasks, with this report, PR.md, RELEASE-NOTES.md and D039 to D041 in place. The first run refused this report's unfilled handoff cost placeholder at `meta`, and the nine suites after it did not run. I filled the line from the readback and reran. The result transition runs the gate again inline.
- `npm run meta`: D039 to D041 indexed. Its health line repeats the standing `REOPEN WO-150-D003` candidate.
- `git diff --check`: clean.

Not re-run: VER-002's mutation controls on criterion 12's other branches, the criterion 13 live attempts, the HEAD prompt replay and the reactor identity check. They judge bytes this review did not change.

## Judgment and publication

D039 to D041 compare their choices with the mission, the eight system traps, Naive Interventionism and NoOp. Against the order's objective, the observed outcome is:
- WO-123 composes primitives whose recorded defects are repaired, each pinned by a fixture.
- The reactor has room: 90,998 of 100,000 characters.
- A verifier on a review stream passes the behaviour it verified and leaves scope and convention defects to the reviewer. This held in three of three live Claude attempts.
- The writer's confined tests can no longer write what its Write tool may not.

The cost of this review was:
- one product gate;
- one live feedback audit (109.5 s);
- one subagent review of the repair;
- the operator's restart of the first session, which is the reviewer agent's error (D040).

Two items remain open as the order recorded them, and both have reopening conditions:
- the two reasoned host imports in the reactor's closure;
- the inline-strike and `repairPlans` decisions the order left as they are.

Result route: `final-review-result pass`.
